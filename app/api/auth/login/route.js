import { NextResponse } from 'next/server';
import { createToken } from '@/utils/jwt';
import { cookies } from 'next/headers';

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

    // Créer le token JWT
    const token = createToken({ email, isAdmin: true });

    // Créer la réponse avec le cookie
    const response = NextResponse.json(
      { success: true, message: 'Connexion réussie' },
      { status: 200 }
    );

    // Définir le cookie avec le token
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Erreur de connexion:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
} 