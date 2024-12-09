const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Supprimer tous les projets existants
  await prisma.project.deleteMany({});
  // Supprimer tous les utilisateurs existants
  await prisma.user.deleteMany({});

  // Créer les projets
  const projects = [
    {
      name: "Application de gestion d'articles de presse",
      tools: ["NextJS", "Material UI", "Redux", "Sun Editor", "Calendar"],
      myRole: "Frontend Developer",
      description: "Développement d'une application de gestion pour les rédactions...",
      code: "",
      demo: "",
      image: ""
    },
    // ... autres projets ...
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  // Créer l'utilisateur admin
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL,
      password: adminPassword,
      isAdmin: true
    }
  });

  console.log('Projets ajoutés avec succès');
  console.log('Admin user créé avec succès');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 