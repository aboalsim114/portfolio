import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/edge-jwt';

export async function middleware(request) {
  // Autoriser l'accès à la page de login
  if (request.nextUrl.pathname === '/dashboard/login') {
    return NextResponse.next();
  }

  // Vérifier le token pour les routes du dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('admin_token')?.value;
    console.log('Token trouvé:', token ? 'oui' : 'non');

    if (!token) {
      console.log('Pas de token');
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }

    const decoded = await verifyToken(token);
    console.log('Résultat décodage:', decoded);

    if (!decoded || !decoded.isAdmin) {
      console.log('Token invalide ou non admin');
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }

    console.log('Accès autorisé');
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
}; 