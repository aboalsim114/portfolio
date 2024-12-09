import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/utils/edge-jwt';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const settings = await prisma.settings.findFirst({
      where: {
        userId: parseInt(decoded.userId)
      }
    });

    return NextResponse.json(settings || {
      theme: 'dark',
      language: 'fr',
      notifications: {
        email: true,
        slack: false
      },
      emailIntegration: {
        enabled: true,
        address: decoded.email
      },
      slackIntegration: {
        enabled: false,
        webhook: ''
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const data = await request.json();

    const settings = await prisma.settings.upsert({
      where: {
        userId: parseInt(decoded.userId)
      },
      update: data,
      create: {
        ...data,
        userId: parseInt(decoded.userId)
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 