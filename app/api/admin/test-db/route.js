import dbConnect from '@/utils/db';

export async function GET() {
  try {
    await dbConnect();
    
    return Response.json({
      success: true,
      message: "Connexion à la base de données réussie !"
    });
  } catch (error) {
    console.error('Test DB Error:', error);
    return Response.json(
      { 
        success: false,
        error: "Erreur de connexion à la base de données",
        details: error.message
      },
      { status: 500 }
    );
  }
} 