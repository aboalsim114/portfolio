import dbConnect from '../utils/db.js';
import '../models/Project.js';
import '../models/Blog.js';
import '../models/Message.js';
import mongoose from 'mongoose';

const Project = mongoose.model('Project');
const Blog = mongoose.model('Blog');
const Message = mongoose.model('Message');

async function seed() {
  try {
    await dbConnect();
    console.log('Connexion à MongoDB établie');

    // Nettoyer les collections existantes
    console.log('Nettoyage des collections...');
    await Promise.all([
      Project.deleteMany({}),
      Blog.deleteMany({}),
      Message.deleteMany({})
    ]);

    // Projets de test
    console.log('Création des projets...');
    await Project.create([
      {
        name: "Portfolio Next.js",
        description: "Portfolio personnel développé avec Next.js et TailwindCSS",
        longDescription: "Un portfolio moderne et responsive...",
        tools: ["Next.js", "React", "TailwindCSS", "MongoDB"],
        github: "https://github.com/username/portfolio",
        featured: true,
        status: "published"
      },
      {
        name: "Dashboard Admin",
        description: "Dashboard administrateur pour la gestion de contenu",
        tools: ["Next.js", "MongoDB", "Docker"],
        status: "published"
      }
    ]);

    // Articles de blog
    console.log('Création des articles...');
    await Blog.create([
      {
        title: "Créer un portfolio avec Next.js",
        description: "Guide complet pour créer un portfolio moderne",
        content: "Contenu détaillé sur la création d'un portfolio...",
        tags: ["Next.js", "React", "Portfolio"],
        status: "published",
        readTime: 8
      },
      {
        title: "Docker pour les développeurs",
        description: "Introduction à Docker et aux conteneurs",
        content: "Découvrez comment utiliser Docker...",
        tags: ["Docker", "DevOps"],
        status: "published",
        readTime: 12
      }
    ]);

    // Messages de test
    console.log('Création des messages...');
    await Message.create([
      {
        name: "John Doe",
        email: "john@example.com",
        subject: "Proposition de collaboration",
        message: "J'aimerais discuter d'une collaboration...",
        status: "new",
        priority: "high"
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        subject: "Question technique",
        message: "J'ai une question concernant Next.js...",
        status: "read",
        priority: "medium",
        read: true,
        readAt: new Date()
      }
    ]);

    console.log('Base de données initialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

seed(); 