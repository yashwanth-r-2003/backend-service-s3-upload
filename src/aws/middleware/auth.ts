import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const adminMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization");

  if (!token) {
    throw new HTTPException(401, {
      message: "No token found",
    });
  }

  if (!token.startsWith("Bearer ")) {
    throw new HTTPException(401, {
      message: "Invalid token format",
    });
  }

  const adminToken = token.split("Bearer ")[1];
  const { ADMIN_SECRET } = env<{ ADMIN_SECRET: string }>(c);

  if (adminToken !== ADMIN_SECRET) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }
  await next();
});