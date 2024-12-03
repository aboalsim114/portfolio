import dbConnect from '@/utils/db';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return Response.json(blogs);
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la récupération des blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const blog = await Blog.create(data);
    return Response.json(blog);
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la création du blog" },
      { status: 500 }
    );
  }
} 