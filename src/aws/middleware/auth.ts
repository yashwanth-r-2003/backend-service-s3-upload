import { ERROR_RESPONSE_CODES } from "../utils/constants";
import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { jwtVerify } from "jose";

type Session = {
  Variables: {
    userId: string;
  };
};

export const authMiddleware = createMiddleware<Session>(async (c, next) => {
  const token = c.req.header("Authorization");

  if (!token) {
    return c.json(
      {
        ...ERROR_RESPONSE_CODES[401],
        details: "No token found",
      },
      401
    );
  }

  if (!token.startsWith("Bearer ")) {
    return c.json(
      {
        ...ERROR_RESPONSE_CODES[401],
        details: "Invalid token format",
      },
      401
    );
  }

  const jwtToken = token.split("Bearer ")[1];
  const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
  const secret = new TextEncoder().encode(JWT_SECRET);

  try {
    const decodedToken = await jwtVerify(jwtToken, secret);
    c.set("userId", decodedToken.payload.sub as string);
    await next();
  } catch (error) {
    return c.json(
      {
        ...ERROR_RESPONSE_CODES[401],
        details: "Unauthorized",
      },
      401
    );
  }
});
