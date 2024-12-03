import dbConnect from '@/utils/db';
import Blog from '@/models/Blog';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const data = await request.json();
    const blog = await Blog.findByIdAndUpdate(params.id, data, { new: true });
    return Response.json(blog);
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la mise à jour du blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    await Blog.findByIdAndDelete(params.id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la suppression du blog" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const blog = await Blog.findById(params.id);
    
    if (!blog) {
      return Response.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    return Response.json(blog);
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la récupération de l'article" },
      { status: 500 }
    );
  }
} 