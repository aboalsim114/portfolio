import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/edge-jwt';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { isAuthenticated: false, message: 'Token manquant' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    console.log('Token décodé:', decoded);

    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json(
        { isAuthenticated: false, message: 'Token invalide ou droits insuffisants' },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur existe toujours en base
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { isAuthenticated: false, message: 'Utilisateur non trouvé ou droits modifiés' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error('Erreur de vérification de session:', error);
    return NextResponse.json(
      { isAuthenticated: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 