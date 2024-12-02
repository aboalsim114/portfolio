import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { question } = await request.json();

    // Contexte pour Gemini
    const context = `Tu es un assistant virtuel répondant aux questions sur Sami Abdulhalim, un développeur Full Stack.
    Informations importantes :
    - Formation : Master Architecture Logicielle à l'ESGI
    - Recherche : Alternance
    - Compétences : React, Node.js, Django, Docker, etc.
    - Expérience : Développeur Web/Mobile Full Stack chez Free Réseaux
    
    Réponds de manière concise et professionnelle, en te basant sur ces informations.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `${context}\n\nQuestion: ${question}\nRéponse:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: "Une erreur est survenue lors du traitement de votre demande" },
      { status: 500 }
    );
  }
} 