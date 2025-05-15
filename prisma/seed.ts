import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const initialPosts = [
  { name: 'Anuncio 1' },
  { name: 'Anuncio 2' },
  { name: 'Anuncio 3' },
];

const testUser = {
  username: 'testuser',
  password: 'testpassword', // Will be hashed
};

async function seed() {
  // Clear existing data
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create test user with hashed password
  await prisma.user.create({
    data: {
      username: testUser.username,
      passwordHash: await bcrypt.hash(testUser.password, 10),
    },
  });

  // Create initial posts
  await Promise.all(
    initialPosts.map(post => 
      prisma.post.create({ data: post })
    )
  );

  console.log('✅ Database seeded successfully');
}

seed()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });