import { Hono } from "hono";
import { uploadFromUrlToS3, uploadFileBufferToS3 } from "./service";
import { authMiddleware } from "./middleware/auth"; 

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use("*", authMiddleware);

app.post("/upload-image", async (c) => {
  const { user_id, session_id, url } = await c.req.json<{
    user_id: string;
    session_id: string;
    url: string;
  }>();

  if (!user_id || !session_id || !url) {
    return c.json({ error: "Missing user_id, session_id, or url" }, 400);
  }
  try {
    const s3Url = await uploadFromUrlToS3(url, "images", user_id, session_id, c.env);
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

app.post("/upload-video", async (c) => {
  const { user_id, session_id, url } = await c.req.json<{
    user_id: string;
    session_id: string;
    url: string;
  }>();

  if (!user_id || !session_id || !url) {
    return c.json({ error: "Missing user_id, session_id, or url" }, 400);
  }
  try {
    const s3Url = await uploadFromUrlToS3(url, "videos", user_id, session_id, c.env);
    return c.json({
      user_id,
      session_id,
      url: s3Url,
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.post("/upload-image-form", async (c) => {
  const formData = await c.req.formData();
  const user_id = formData.get("user_id") as string;
  const session_id = formData.get("session_id") as string;
  const file = formData.get("file") as File;

  if (!user_id || !session_id || !file) {
    return c.json({ error: "Missing user_id, session_id, or file" }, 400);
  }

  try {
    const s3Url = await uploadFileBufferToS3(file, user_id, session_id, c.env);
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

export default app;
