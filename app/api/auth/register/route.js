import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin: false // Par défaut, les nouveaux utilisateurs ne sont pas admin
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Inscription réussie',
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
} 