// service.ts
import { uploadBufferToS3 } from "./data-layer";



export async function uploadFromUrlToS3(
  url: string,
  keyPrefix: string,
  user_id: string,
  session_id: string,
  env: CloudflareBindings
): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch file");
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const ext = contentType.split("/")[1] || "bin";
  const key = `${keyPrefix}/${user_id}/${session_id}.${ext}`;
  const body = await res.arrayBuffer();

  await uploadBufferToS3(env, key, body, contentType);

  return `https://d2qhtu0wg9l2qp.cloudfront.net/${key}`;
}

export async function uploadFileBufferToS3(
  file: File,
  user_id: string,
  session_id: string,
  env: CloudflareBindings
): Promise<string> {
  const contentType = file.type || "application/octet-stream";
  const ext = contentType.split("/")[1] || "bin";
  const key = `images/${user_id}/${session_id}.${ext}`;
  const body = await file.arrayBuffer();

  await uploadBufferToS3(env, key, body, contentType);

  return `https://d2qhtu0wg9l2qp.cloudfront.net/${key}`;
}
