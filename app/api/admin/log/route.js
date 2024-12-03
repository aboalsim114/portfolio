export async function POST(request) {
  try {
    const { action, details } = await request.json();
    
    // Ici vous pourriez implémenter la journalisation dans une base de données
    console.log(`[ADMIN LOG] ${new Date().toISOString()} - ${action}:`, details);
    
    return Response.json({ success: true });
  } catch (error) {
    console.error("Logging error:", error);
    return Response.json({ error: "Erreur de journalisation" }, { status: 500 });
  }
} 