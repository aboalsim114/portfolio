import dbConnect from '@/utils/db';
import Project from '@/models/Project';
import Blog from '@/models/Blog';
import Message from '@/models/Message';

export async function GET() {
  try {
    await dbConnect();

    const [projects, blogs, messages, unreadMessages] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ read: false })
    ]);

    // Calculer les tendances (exemple simple)
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [recentProjects, recentBlogs, recentMessages] = await Promise.all([
      Project.countDocuments({ createdAt: { $gte: lastWeek } }),
      Blog.countDocuments({ createdAt: { $gte: lastWeek } }),
      Message.countDocuments({ createdAt: { $gte: lastWeek } })
    ]);

    return Response.json({
      projects,
      blogs,
      messages,
      unreadMessages,
      trends: {
        projects: ((recentProjects / projects) * 100).toFixed(1),
        blogs: ((recentBlogs / blogs) * 100).toFixed(1),
        messages: ((recentMessages / messages) * 100).toFixed(1)
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
} 