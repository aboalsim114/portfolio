import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { type, topic, tools } = await request.json();

    let prompt = "";
    switch (type) {
      case "blog":
        prompt = `Génère un article de blog technique en français sur "${topic}".
        Format :
        - Titre accrocheur
        - Introduction
        - 3-4 sections principales
        - Conclusion
        - Mots-clés SEO`;
        break;
      case "project":
        prompt = `Génère une description détaillée en français pour un projet sur "${topic}".
        ${tools ? `Le projet utilise les technologies suivantes : ${tools}.` : ''}
        
        Format de réponse souhaité :
        Nom du projet : [nom accrocheur et professionnel]
        Description : [description détaillée en 2-3 phrases]
        Technologies utilisées : [liste des technologies principales]
        Fonctionnalités principales :
        - [fonctionnalité 1]
        - [fonctionnalité 2]
        - [fonctionnalité 3]
        Points forts :
        - [point fort 1]
        - [point fort 2]
        - [point fort 3]

        La description doit être professionnelle et mettre en avant les aspects techniques.`;
        break;
      case "skill":
        prompt = `Rédige une description professionnelle en français de la compétence "${topic}".
        Format :
        - Définition
        - Cas d'utilisation
        - Niveau de maîtrise requis
        - Technologies associées`;
        break;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return Response.json({ content: response.text() });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: "Erreur lors de la génération" },
      { status: 500 }
    );
  }
} 