import { NextResponse } from 'next/server';
import { createToken } from '@/utils/jwt';
import { cookies } from 'next/headers';
import { SessionService } from '@/utils/session-service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Vérifier les credentials admin
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Créer le token JWT et la session
    const userData = {
      id: 1,
      email,
      isAdmin: true,
      lastActivity: new Date().toISOString()
    };
    
    const token = createToken(userData);
    const sessionId = SessionService.createSession(1, userData);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    };

    const response = NextResponse.json(
      { success: true, message: 'Connexion réussie' },
      { status: 200 }
    );

    response.cookies.set('admin_token', token, cookieOptions);
    response.cookies.set('session_id', sessionId, cookieOptions);

    return response;

  } catch (error) {
    console.error('Erreur de connexion:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
} 