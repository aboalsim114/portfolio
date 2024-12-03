import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(request) {
  // Permettre l'accès à la page de login
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protection des routes admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token");

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token.value, secret);
      return NextResponse.next();
    } catch (error) {
      // Si le token est invalide ou expiré
      request.cookies.delete("admin_token");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
}; 