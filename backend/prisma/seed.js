require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed en cours...');

  // Admin
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin1234!', 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@adcognita.fr' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@adcognita.fr',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Ad Cognita',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin créé : ${admin.email}`);

  // Client de test
  const clientPassword = await bcrypt.hash('Client1234!', 12);
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@test.fr' },
    update: {},
    create: {
      email: 'client@test.fr',
      password: clientPassword,
      firstName: 'Marie',
      lastName: 'Dupont',
      phone: '06 12 34 56 78',
      role: 'CLIENT',
    },
  });
  let client = await prisma.client.findUnique({ where: { userId: clientUser.id } });
  if (!client) {
    client = await prisma.client.create({ data: { userId: clientUser.id, status: 'client' } });
  }
  console.log(`✅ Client de test créé : ${clientUser.email}`);

  // Formations
  const formations = [
    { title: 'Excel Avancé', description: 'Maîtrisez les fonctions avancées d\'Excel', objectives: 'Tableaux croisés, macros, automatisation', duration: '2 jours (14h)', price: 790, modalities: 'Présentiel ou distanciel', category: 'Bureautique', status: 'PUBLISHED' },
    { title: 'Management d\'équipe', description: 'Développez vos compétences managériales', objectives: 'Leadership, motivation, gestion des conflits', duration: '3 jours (21h)', price: 1290, modalities: 'Présentiel', category: 'Management', status: 'PUBLISHED' },
    { title: 'Communication professionnelle', description: 'Améliorez votre communication en entreprise', objectives: 'Prise de parole, écrits professionnels, assertivité', duration: '2 jours (14h)', price: 890, modalities: 'Présentiel ou distanciel', category: 'Communication', status: 'PUBLISHED' },
    { title: 'Gestion de projet Agile', description: 'Méthodes agiles pour vos projets', objectives: 'Scrum, Kanban, planification', duration: '2 jours (14h)', price: 990, modalities: 'Présentiel', category: 'Gestion de projet', status: 'PUBLISHED' },
  ];

  for (const f of formations) {
    await prisma.formation.upsert({ where: { slug: f.title.toLowerCase().replace(/ /g, '-') }, update: {}, create: { ...f, slug: f.title.toLowerCase().replace(/ /g, '-') } });
  }
  console.log(`✅ ${formations.length} formations créées`);

  console.log('\n🎉 Seed terminé !');
  console.log('───────────────────────────────');
  console.log(`Admin    : ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin1234!'}`);
  console.log('Client   : client@test.fr / Client1234!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
