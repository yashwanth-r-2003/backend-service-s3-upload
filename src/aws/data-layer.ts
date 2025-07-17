
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const createS3Client = (env: CloudflareBindings) => {
  return new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
};

export async function uploadBufferToS3(
  env: CloudflareBindings,
  key: string,
  body: ArrayBuffer,
  contentType: string
): Promise<void> {
  const s3 = createS3Client(env);

  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}
