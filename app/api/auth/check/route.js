import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = cookies().get("admin_token");

    if (!token) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token.value, secret);

    return Response.json({ authenticated: true });
  } catch (error) {
    return Response.json({ error: "Session invalide" }, { status: 401 });
  }
} 