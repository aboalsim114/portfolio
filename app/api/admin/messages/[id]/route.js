import dbConnect from '@/utils/db';
import Message from '@/models/Message';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const data = await request.json();
    const message = await Message.findByIdAndUpdate(params.id, data, { new: true });
    return Response.json(message);
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la mise à jour du message" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    await Message.findByIdAndDelete(params.id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la suppression du message" },
      { status: 500 }
    );
  }
} 