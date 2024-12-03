import dbConnect from '@/utils/db';
import Message from '@/models/Message';

export async function GET() {
  try {
    await dbConnect();
    const messages = await Message.find().sort({ createdAt: -1 });
    return Response.json(messages);
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { ids, update } = await request.json();
    await Message.updateMany(
      { _id: { $in: ids } },
      update
    );
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la mise à jour des messages" },
      { status: 500 }
    );
  }
} 