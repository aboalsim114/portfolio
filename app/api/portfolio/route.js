import dbConnect from '@/utils/db';
import Project from '@/models/Project';
import Blog from '@/models/Blog';
import { personalData } from '@/utils/data/personal-data';
import { educations } from '@/utils/data/educations';
import { experiences } from '@/utils/data/experience';
import { skillsData } from '@/utils/data/skills';

export async function GET() {
  try {
    await dbConnect();
    
    const [projects, blogs] = await Promise.all([
      Project.find({ status: 'published' }).sort({ createdAt: -1 }),
      Blog.find({ status: 'published' }).sort({ createdAt: -1 })
    ]);

    return Response.json({
      projects,
      blogs,
      personal: personalData,
      education: educations,
      experience: experiences,
      skills: skillsData
    });
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
} 