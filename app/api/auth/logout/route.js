import { cookies } from "next/headers";

export async function POST() {
  try {
    cookies().delete("admin_token");
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
} 