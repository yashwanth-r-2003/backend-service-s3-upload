import { Hono } from "hono";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";



const awsRoutes = new Hono<{ Bindings: CloudflareBindings }>();

async function uploadFromUrlToS3(
  url: string,
  keyPrefix: string,
  user_id: string,
  session_id: string,
  env: CloudflareBindings
): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch file");
  const contentType =
    res.headers.get("content-type") || "application/octet-stream";
  const ext = contentType.split("/")[1] || "bin";
  const key = `${keyPrefix}/${user_id}/${session_id}.${ext}`;
  const body = await res.arrayBuffer();
  console.log("AWS_REGION:", env.AWS_REGION);
  const s3 = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

awsRoutes.post("/upload-image", async (c) => {
  const { user_id, session_id, url } = await c.req.json<{
    user_id: string;
    session_id: string;
    url: string;
  }>();
  if (!user_id || !session_id || !url) {
    return c.json({ error: "Missing user_id, session_id, or url" }, 400);
  }
  try {
    const s3Url = await uploadFromUrlToS3(
      url,
      "images",
      user_id,
      session_id,
      c.env
    );
    return c.json({
      user_id,
      session_id,
      url: s3Url,
    });
  } catch (e: any) {
    console.error("Upload error:", e);
    return c.json({ error: e.message }, 500);
  }
});

awsRoutes.post("/upload-video", async (c) => {
  const { user_id, session_id, url } = await c.req.json<{
    user_id: string;
    session_id: string;
    url: string;
  }>();
  if (!user_id || !session_id || !url) {
    return c.json({ error: "Missing user_id, session_id, or url" }, 400);
  }
  try {
    const s3Url = await uploadFromUrlToS3(
      url,
      "videos",
      user_id,
      session_id,
      c.env
    );
    return c.json({
      user_id,
      session_id,
      url: s3Url,
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

awsRoutes.post("/upload-image-form", async (c) => {
  const formData = await c.req.formData();
  const user_id = formData.get("user_id") as string;
  const session_id = formData.get("session_id") as string;
  const file = formData.get("file") as File;

  if (!user_id || !session_id || !file) {
    return c.json({ error: "Missing user_id, session_id, or file" }, 400);
  }

  const contentType = file.type || "application/octet-stream";
  const ext = contentType.split("/")[1] || "bin";
  const key = `images/${user_id}/${session_id}.${ext}`;
  const body = await file.arrayBuffer();

  try {
    const s3 = new S3Client({
      region: c.env.AWS_REGION,
      credentials: {
        accessKeyId: c.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: c.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: c.env.AWS_S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );

    const s3Url = `https://${c.env.AWS_S3_BUCKET}.s3.${c.env.AWS_REGION}.amazonaws.com/${key}`;
    return c.json({
      user_id,
      session_id,
      url: s3Url,
    });
  } catch (e: any) {
    console.error("Upload error:", e);
    return c.json({ error: e.message }, 500);
  }
});

export default awsRoutes;
