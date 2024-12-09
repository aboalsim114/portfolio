import { NextResponse } from 'next/server';
import { createToken } from '@/utils/edge-jwt';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Tentative de connexion:', email);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      console.log('Authentification échouée');
      return NextResponse.json(
        { success: false, message: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    console.log('Utilisateur trouvé:', user);

    // Créer le token JWT avec toutes les informations nécessaires
    const token = await createToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    });

    if (!token) {
      throw new Error('Erreur de création du token');
    }

    console.log('Token créé');

    const response = NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

    // Définir le cookie avec le token
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
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