import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Récupérer tous les projets
    const projects = await prisma.project.findMany();

    // Calculer les projets par mois (6 derniers mois)
    const now = new Date();
    const monthlyProjects = Array(6).fill(0);
    
    projects.forEach(project => {
      const projectDate = new Date(project.createdAt);
      const monthDiff = (now.getMonth() + 12 - projectDate.getMonth()) % 12;
      if (monthDiff < 6) {
        monthlyProjects[5 - monthDiff]++;
      }
    });

    // Calculer les technologies utilisées
    const techStack = {
      react: projects.filter(p => p.tools.includes('React')).length,
      nodejs: projects.filter(p => p.tools.includes('Node.js')).length,
      nextjs: projects.filter(p => p.tools.includes('Next.js')).length,
      typescript: projects.filter(p => p.tools.includes('TypeScript')).length,
      tailwind: projects.filter(p => p.tools.includes('TailwindCSS')).length,
      mongodb: projects.filter(p => p.tools.includes('MongoDB')).length
    };

    return NextResponse.json({
      monthlyProjects,
      techStack
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 