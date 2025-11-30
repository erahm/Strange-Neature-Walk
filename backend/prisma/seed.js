import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Sanity check for DATABASE_URL; provide helpful guidance when running locally vs in docker
  const databaseUrl = process.env.DATABASE_URL || '';
  if (databaseUrl.includes('@db:') && process.env.RUNNING_IN_DOCKER !== 'true') {
    console.warn('\nWARNING: DATABASE_URL looks like it is configured for a Docker network (host=`db`).');
    console.warn('If you are running this script locally (not in Docker), change `DATABASE_URL` in `backend/.env` to use `localhost` instead of `db`.');
    console.warn('Example: postgresql://postgres:postgres@localhost:5432/snwdb?schema=public\n');
  }

  const users = [
    { name: 'Bob', email: 'bob@example.com', password: 'password', role: 'VIEWER' },
    { name: 'Manager', email: 'manager@example.com', password: 'password', role: 'MANAGER' },
    { name: 'Admin', email: 'admin@example.com', password: 'password', role: 'ADMIN' }
  ];

  const exhibitCategories = [
    { name: 'Flora' },
    { name: 'Fauna' },
    { name: 'Fungi' }
  ];

  const exhibits = [
    { name: 'Bear', description: "It is estimated that bears kill over two million salmon a year. Attacks by salmon on bears are much more rare. Right, that's got to be true, right?", categoryName: 'Fauna', imageUrl: 'https://i.ytimg.com/vi/PjroTXtMtIA/hqdefault.jpg' },
    { name: 'Shark', description: "Menacing and terrifying, the shark has been menacing and terrifying for over a decade!", categoryName: 'Fauna', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzdMq3MiF87k9nWRNdxEN_YvPenpLj2gt5JQ&s' },
    { name: 'Aspen', description: "You can tell that it's and aspen because of the way it is.", categoryName: 'Flora', imageUrl: 'https://i.ytimg.com/vi/wKiXdqaY180/hqdefault.jpg' },
    { name: 'Pinecone', description: "Early settlers thought that pinecones were actually tree poop.", categoryName: 'Flora', imageUrl: 'https://i.ytimg.com/vi/a_C18uAZHdo/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGEYgZSgqMA8=&rs=AOn4CLA63Y21RBIwHQXDIOoOzXKa3TRVzA' },
    { name: 'Christmas Tree', description: "Although a tidbit of information that not everybody knows is that Christmas trees actually grow all year round.", categoryName: 'Flora', imageUrl: 'https://i.ytimg.com/vi/a_C18uAZHdo/hqdefault_141100.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGEYgZSgqMA8=&rs=AOn4CLA7LKdD6jv-taUS6UGRi3EBUGvkKg' }
  ]

  users.forEach( async (user) => {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    if (!existing) {
      const hashed = await bcrypt.hash(user.password, 10);
      const data = { name: user.name, email: user.email, password: hashed };
      if (user.role) {
        data.role = user.role;
      }
      await prisma.user.create({ data });
    }
  });

  exhibitCategories.forEach(async (category) => {
    const existing = await prisma.exhibitCategory.findUnique({ where: { name: category.name } });
    if (!existing) {
      await prisma.exhibitCategory.create({ data: category });
    }
  });

  exhibits.forEach( async (exhibit) => {
    const category = await prisma.exhibitCategory.findUnique({ where: { name: exhibit.categoryName } });
    if (category) {
      const data = {
        name: exhibit.name,
        description: exhibit.description,
        imageUrl: exhibit.imageUrl,
        categoryId: category.id
      };
      await prisma.exhibit.create({ data });
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch(async (e) => {
    console.error('Seeding failed with an error:');
    console.error(e.message || e);
    if (e.message && e.message.toLowerCase().includes('connect')) {
      console.error('\nHint: Could not connect to the DB server. Check that:');
      console.error('- DATABASE_URL is correct in backend/.env (use localhost if running locally, or `db` when running inside Docker).');
      console.error('- The Postgres server is running (docker-compose up -d db or local `postgres` service).');
      console.error('- Your network or firewall is not blocking the DB port (5432).');
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
