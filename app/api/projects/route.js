import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Ajout du handler par défaut
export const dynamic = 'force-dynamic';

// Modification des exports pour être plus explicites
export const GET = async (request) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        id: 'desc'
      }
    });
    
    // Log pour déboguer
    console.log('Nombre de projets trouvés:', projects.length);
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Erreur GET projects:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des projets' },
      { status: 500 }
    );
  }
};

export const POST = async (request) => {
  try {
    const data = await request.json();
    
    if (!data.name || !data.description || !data.tools || !data.myRole) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        tools: data.tools,
        myRole: data.myRole,
        code: data.code || '',
        demo: data.demo || '',
        image: data.image || ''
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Erreur POST project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du projet' },
      { status: 500 }
    );
  }
};

export const PUT = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du projet manquant' },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        description: data.description,
        tools: data.tools,
        myRole: data.myRole,
        code: data.code || '',
        demo: data.demo || '',
        image: data.image || ''
      }
    });
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Erreur PUT project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du projet' },
      { status: 500 }
    );
  }
};

export const DELETE = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du projet manquant' },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du projet' },
      { status: 500 }
    );
  }
}; 