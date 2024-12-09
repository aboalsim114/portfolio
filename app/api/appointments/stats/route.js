import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany();
    
    // Calculer le nombre de rendez-vous par jour de la semaine
    const weeklyAppointments = Array(7).fill(0);
    
    appointments.forEach(appointment => {
      const date = new Date(appointment.date);
      const dayOfWeek = date.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
      const adjustedDay = (dayOfWeek + 6) % 7; // Ajuster pour commencer par Lundi
      weeklyAppointments[adjustedDay]++;
    });

    return NextResponse.json({
      weeklyAppointments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 