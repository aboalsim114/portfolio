const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Supprimer tous les projets existants
  await prisma.project.deleteMany({});

  // Créer les projets
  const projects = [
    {
      name: "Application de gestion d'articles de presse",
      tools: ["NextJS", "Material UI", "Redux", "Sun Editor", "Calendar"],
      myRole: "Frontend Developer",
      description: "Développement d'une application de gestion pour les rédactions. Création de dashboards interactifs utilisant NextJS, Material UI, et Redux, avec des fonctionnalités avancées comme un calendrier intégré et des éditeurs de texte enrichis.",
      code: "",
      demo: "",
      image: ""
    },
    {
      name: "Système d'authentification sécurisé",
      tools: ["React", "Redux", "JWT", "Formik", "Node.js", "MongoDB"],
      myRole: "Développeur Full Stack",
      description: "Développement d'un système d'authentification utilisant JWT et Redux. Intégration de fonctionnalités comme l'inscription, la connexion et la gestion des droits d'accès dans un espace administrateur. Notifications en temps réel pour les utilisateurs grâce à un système d'alertes.",
      code: "",
      demo: "",
      image: ""
    },
    {
      name: "Gestion d'inventaire e-commerce",
      tools: ["React", "Node.js", "Express", "Docker", "PostgreSQL"],
      myRole: "Backend Developer",
      description: "Création d'une API pour la gestion d'inventaire, intégrée à un système de gestion des stocks, augmentant l'efficacité de 30 %. Mise en place d'environnements de développement avec Docker pour faciliter les tests et l'intégration continue.",
      code: "",
      demo: "",
      image: ""
    },
    {
      name: "Optimisation UX pour site e-commerce",
      tools: ["React", "Bootstrap", "MySQL", "PHP"],
      myRole: "Frontend Developer",
      description: "Travail sur la refonte de la page d'accueil d'un site e-commerce, réduisant les temps de chargement de 40 %. Contribution à l'amélioration de l'expérience utilisateur grâce à des optimisations front-end.",
      code: "",
      demo: "",
      image: ""
    }
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log('Projets ajoutés avec succès');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 