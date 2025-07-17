import { SignJWT } from "jose";

async function generateToken() {
  const secret = new TextEncoder().encode("fea81f9e91f1c9fbe0c952cb1e266966e749aa678c10de77e914451816527063");

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("user123")        
    .setExpirationTime("1h")
    .sign(secret);

  console.log("JWT Token:", token);
}

generateToken();
