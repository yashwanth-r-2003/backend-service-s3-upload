import { SignJWT } from "jose";

async function generateToken() {
  const secret = new TextEncoder().encode("your-very-secret-jwt-secret");

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("user123")         // your user id or subject
    .setExpirationTime("1h")
    .sign(secret);

  console.log("JWT Token:", token);
}

generateToken();
