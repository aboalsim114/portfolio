import dbConnect from '@/utils/db';
import Project from '@/models/Project';
import Blog from '@/models/Blog';
import { personalData } from '@/utils/data/personal-data';
import { educations } from '@/utils/data/educations';
import { experiences } from '@/utils/data/experience';
import { skillsData } from '@/utils/data/skills';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    await dbConnect();
    
    // Récupérer tous les projets publiés
    const projects = await Project.find({ status: 'published' })
      .sort({ createdAt: -1 });
    
    // Récupérer tous les articles publiés
    const blogs = await Blog.find({ status: 'published' })
      .sort({ createdAt: -1 });

    return Response.json({
      personal: personalData,
      education: educations,
      experience: experiences,
      skills: skillsData,
      projects,
      blogs
    });
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { section, content } = data;

    // Chemin vers les fichiers de données
    const dataPath = join(process.cwd(), 'utils', 'data');

    switch (section) {
      case 'experience':
        await writeFile(
          join(dataPath, 'experience.js'),
          `export const experiences = ${JSON.stringify(content, null, 2)};`
        );
        break;
      case 'education':
        await writeFile(
          join(dataPath, 'educations.js'),
          `export const educations = ${JSON.stringify(content, null, 2)};`
        );
        break;
      case 'personal':
        // Mettre à jour personalData
        break;
      case 'skills':
        // Mettre à jour skillsData
        break;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return Response.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
} 