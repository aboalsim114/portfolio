import dbConnect from '@/utils/db';
import Project from '@/models/Project';

// Mettre à jour un projet
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const data = await request.json();
    const project = await Project.findByIdAndUpdate(params.id, data, { new: true });
    return Response.json(project);
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la mise à jour du projet" },
      { status: 500 }
    );
  }
}

// Supprimer un projet
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    await Project.findByIdAndDelete(params.id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la suppression du projet" },
      { status: 500 }
    );
  }
} 