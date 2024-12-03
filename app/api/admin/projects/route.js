import dbConnect from '@/utils/db';
import Project from '@/models/Project';

// Récupérer tous les projets
export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find().sort({ createdAt: -1 });
    return Response.json(projects);
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la récupération des projets" },
      { status: 500 }
    );
  }
}

// Créer un nouveau projet
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const project = await Project.create(data);
    return Response.json(project);
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la création du projet" },
      { status: 500 }
    );
  }
} 