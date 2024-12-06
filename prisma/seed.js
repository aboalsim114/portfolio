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
    // Ajoutez d'autres projets ici...
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