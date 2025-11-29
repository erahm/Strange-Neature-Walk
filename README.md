# Strange Neature Walk

This repository provides a minimal full-stack example implemented with React (Vite) on the frontend and Node.js on the backend with GraphQL.

Key features
- React + Vite + Apollo Client frontend
- Node.js + Express + Apollo Server (v4) backend
- Prisma ORM with PostgreSQL
- Authorization using CASL
- Docker Compose for local development (database + services)

---

## Requirements
- Node.js >= 24 for local development (Docker uses Node 24 in containers)
- npm (or yarn)
- Docker & Docker Compose (recommended for a reproducible environment)

---

## Quick start — Docker (recommended)

This will build and start the services (Postgres, backend and frontend), apply migrations and seed the database automatically.

```bash
# From the repo root
docker-compose up --build
```

Visit the app:
- Frontend: http://localhost:5173
- GraphQL endpoint: http://localhost:4000/graphql

To stream backend logs when running containers detached:

```bash
docker-compose logs -f backend
```

To stop and remove containers:

```bash
docker-compose down
```

To kill a specific container and keep others running:

```bash
docker-compose kill <container name>
```

---

## Local development — Backend

1) Ensure Node >= 24 on your machine. Use nvm if required:

```bash
nvm install 24
nvm use 24
```

2) Install backend dependencies and create a `.env` file:

```bash
cd backend
npm install
cp .env.example .env
# If you run the backend locally, change DATABASE_URL to use localhost instead of `db`.
```

3) Generate Prisma client, apply migrations and seed (development flow):

```bash
npm run prisma:generate
npx prisma migrate dev --name init    # creates & applies a local migration
npm run seed                          # seeds some example data
```

4) Start the dev server:

```bash
npm run dev
```

---

## Local development — Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs at http://localhost:5173 by default.

---

## Prisma migrations & seed

- Migrations live in `backend/prisma/migrations/`. Keep this directory in source control and rely on `npx prisma migrate dev` (local) or `npx prisma migrate deploy` (CI/production) for applying them.
- The startup script in Docker runs migrations with `npx prisma migrate deploy || npx prisma db push`, followed by the seeding script `node prisma/seed.js`.

Create a new migration after editing the schema:

```bash
cd backend
npx prisma migrate dev --name add_field
```

Apply migrations in CI/Production:

```bash
npx prisma migrate deploy
```

---

## Authentication & seeded users

- The backend uses JWT for authentication and CASL for authorization.
- Dev seeding creates a set of sample users with `password` as the password:

- bob@example.com / password (VIEWER)
- manager@example.com / password (MANAGER)
- admin@example.com / password (ADMIN)

Use the login mutation to obtain a JWT and set it in the `Authorization` header: `Authorization: Bearer <token>`.

---