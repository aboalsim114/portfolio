import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { stats } = await request.json();

    const prompt = `En tant qu'analyste de portfolio, analyse ces statistiques :
    - ${stats.projects} projets
    - ${stats.blogs} articles de blog
    - ${stats.messages} messages

    Fournis une analyse détaillée en français qui inclut :
    1. Une évaluation de l'activité du portfolio
    2. Des suggestions d'amélioration
    3. Des recommandations stratégiques

    Format : Paragraphes clairs avec points clés.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return Response.json({ analysis: response.text() });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: "Erreur lors de l'analyse" },
      { status: 500 }
    );
  }
} 