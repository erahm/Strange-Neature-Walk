const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
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
    { name: 'Alice', email: 'alice@example.com', password: 'password', role: 'VIEWER' },
    { name: 'Bob', email: 'bob@example.com', password: 'password', role: 'VIEWER' },
    { name: 'Carol', email: 'carol@example.com', password: 'password', role: 'VIEWER' },
    { name: 'Manager', email: 'manager@example.com', password: 'password', role: 'MANAGER' },
    { name: 'Admin', email: 'admin@example.com', password: 'password', role: 'ADMIN' }
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      const hashed = await bcrypt.hash(u.password, 10);
      const data = { name: u.name, email: u.email, password: hashed };
      if (u.role) data.role = u.role;
      await prisma.user.create({ data });
    }
  }
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
