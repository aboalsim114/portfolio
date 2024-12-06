import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // Vérification des données reçues
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID ou statut manquant' },
        { status: 400 }
      );
    }

    // Vérification que le statut est valide
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Mise à jour du rendez-vous
    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    return NextResponse.json({
      success: true,
      appointment
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la mise à jour du rendez-vous',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 