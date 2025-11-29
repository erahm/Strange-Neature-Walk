# Strange Neature Walk — Fullstack Starter

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

To stream backend logs:

```bash
docker-compose logs -f backend
```

To stop and remove containers:

```bash
docker-compose down
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

Notes:
- For a production-like environment (or in Docker), you may prefer `npx prisma migrate deploy` instead of `migrate dev`.
- If you want to push schema changes without migrations during rapid iteration, `npx prisma db push` can be used (not recommended for production).

---

## Local development — Frontend

```bash
cd frontend
npm install
cp .env.example .env
# If running the frontend locally via Vite dev server, use `/graphql` proxy or set `VITE_API_URL` to `http://localhost:4000/graphql` in `frontend/.env`.
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

## GraphQL server & API

- GraphQL endpoint: `POST http://localhost:4000/graphql` (the server runs with `@apollo/server` v4 + Express middleware mounted at `/graphql`).
- If using a GraphQL IDE (Apollo Studio Sandbox or similar) you can open the endpoint in the browser.

Sample query:

```graphql
query GetUsers {
  users {
    id
    name
    email
    role
    createdAt
  }
}
```

Sample mutation (register/login handled in frontend):

```graphql
mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    token
    user { id name email role }
  }
}
```

---

## Authentication & seeded users

- The backend uses JWT for authentication and CASL for authorization.
- Dev seeding creates a set of sample users with `password` as the password:

- alice@example.com / password (VIEWER)
- bob@example.com / password (VIEWER)
- carol@example.com / password (VIEWER)
- manager@example.com / password (MANAGER)
- admin@example.com / password (ADMIN)

Use the login mutation to obtain a JWT and set it in the `Authorization` header: `Authorization: Bearer <token>`.

---

## Notes & gotchas

- If you see syntax errors or Prisma preinstall failures when running `npm install` locally, ensure Node >= 24 is used.
- If you'd like to preserve the `/graphql` path while using Apollo Server v4, we used `expressMiddleware` from `@apollo/server/express4` in `backend/server.js`.
- Keep `prisma/migrations/` in version control and generate migrations using the CLI (`npx prisma migrate dev --name ...`) for reproducible schema changes.

---

## Contributing

PRs are welcome. Some ideas for improvements:
- Add tests (unit/integration & E2E), and CI that runs them.
- Add ESLint, Prettier, and lint/format checks for consistent style.
- Upgrade to stable, modern Apollo Server versions when available.

---

Enjoy! 🚀
# Strange Neature Walk — Fullstack Starter

This repository is a minimal full-stack JavaScript application demonstrating a GraphQL server and a React frontend:

- Frontend: Vite + React + Apollo Client
- Backend: Node.js + Express + Apollo Server (v4) + GraphQL
- Prisma ORM + PostgreSQL (Docker)
- Authorization with CASL
- Docker Compose for running DB and services

This README covers how to run the project both with Docker (recommended for first-time setup) and locally for development.

---

## Requirements

- Node.js >= 24 (local development). Docker uses Node 24 in containers to ensure compatibility.
- npm (or yarn) for installing packages.
- Docker & Docker Compose for an isolated development environment.

---

## Quick start — Docker (recommended)

This will build and start the services (DB, backend and frontend) and apply migrations + seed the database automatically.

From the repo root:

```bash
docker-compose up --build
```

Then access:

- Frontend: http://localhost:5173
- GraphQL endpoint: http://localhost:4000/graphql

To view logs for a service:

```bash
docker-compose logs -f backend
```

To stop/remove:

```bash
docker-compose down
```

---

## Development — Backend (local)

If you prefer to develop the backend locally (outside Docker), ensure Node 24+ is active and do the following:

```bash
# from repo root
cd backend
npm install
cp .env.example .env    # and edit DATABASE_URL if needed (use localhost for local DB)

# generate Prisma client
npm run prisma:generate

# Apply migrations (creates/updates schema)
npx prisma migrate dev --name init

# Seed the DB (optional)
npm run seed

# Start the dev server
npm run dev
```

Notes:
- When running locally, set `DATABASE_URL` in `backend/.env` to point at `localhost` (e.g., `postgresql://postgres:postgres@localhost:5432/snwdb?schema=public`) rather than `db`.
- If you want to force pushing the schema without migrations for dev, run `npx prisma db push` instead, though migrations are recommended for controlled changes.

---

## Development — Frontend (local)

```bash
cd frontend
npm install
cp .env.example .env  # point VITE_API_URL to your backend (e.g., http://localhost:4000/graphql)
npm run dev
```

The Vite dev server runs on http://localhost:5173 by default.

---

## Prisma migrations & seed

- Migrations are in `backend/prisma/migrations/` and are applied by `npx prisma migrate deploy` in production or `npx prisma migrate dev` in development.
- The Docker entrypoint will run `npx prisma migrate deploy || npx prisma db push` and then run the `node prisma/seed.js` script.
- To create a new migration locally after editing `prisma/schema.prisma`:

```bash
cd backend
npx prisma migrate dev --name add_changes
```

This will generate a new migration directory under `backend/prisma/migrations` and apply it (dev environment).

To apply migrations in CI/production, use:

```bash
npx prisma migrate deploy
```

---

## GraphQL server

- Endpoint: `POST http://localhost:4000/graphql`
- The backend uses `@apollo/server` (v4) with `express` middleware mounted at `/graphql`.
- If running inside Docker, the frontend is built with `VITE_API_URL=/graphql` so the JS will call `/graphql` relative to the frontend origin; nginx in the frontend container proxies `/graphql` to the backend container.
- If running the frontend locally via `vite`, the dev server proxies `/graphql` to the backend at `http://localhost:4000` by default. If you prefer not to use the dev proxy, set `VITE_API_URL` to `http://localhost:4000/graphql` in `frontend/.env`.

Example query:

```graphql
query GetUsers {
  users {
    id
    name
    email
    role
    createdAt
  }
}
```

Example mutation (register/login handled in the frontend):

```graphql
mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    token
    user { id name email role }
  }
}
```

---

## Authentication & seeded users

The backend uses JWT for authentication and CASL for authorization. In dev, a default seed creates demo users. The default seeded users use `password` as the password:

- alice@example.com / password (VIEWER)
- bob@example.com / password (VIEWER)
- carol@example.com / password (VIEWER)
- manager@example.com / password (MANAGER)
- admin@example.com / password (ADMIN)

Use `/login` mutation to authenticate and get a token, then add `authorization: Bearer <token>` to headers.

---

## Notes & gotchas

- Node version: If you try to run the backend using an older Node version (e.g., 14), you may encounter syntax errors or tools like Prisma failing during `npm install`. Use Node >= 24 for local development.
- Apollo Server: this repo uses `@apollo/server` (v4) with `expressMiddleware` to integrate with `express`. The GraphQL endpoint is `/graphql`.
- Prisma & migrations: Keep the `prisma/migrations/` folder in the repo and update it via `npx prisma migrate dev` to ensure team members and CI deployment have the same migrations.

---

## Contributing

PRs are welcome — please follow standard practices (small, well-documented changes). Consider the following improvements:
- Add tests (GraphQL integration tests and E2E for basic flows)
- Add ESLint/Prettier and formatting checks
- Upgrade to newer Apollo Server major versions when available and stable

---

Enjoy! 🚀
# Strange Neature Walk — Fullstack Starter

This repository demonstrates a minimal full-stack JavaScript application with:

- React (Vite) + React Router + Apollo Client
- Node.js + Express + Apollo Server + GraphQL
- Prisma ORM on top of PostgreSQL24.11.1
- CASL for general AuthZ
- Docker Compose for PostgreSQL

## Quick start (native dev)

 Requirements: Node.js (>= 24), npm or yarn, Docker (for Postgres), and npx.

1. Start Everything (via Docker Compose):

```bash
# Start everything
docker-compose up -d

# View API logs
docker-compose logs --follow backend
```

2. Backend: install dependencies and setup Prisma

```bash
# cd backend
# install dependencies
cd backend
npm install
cp .env.example .env
# NOTE: The default DATABASE_URL in `.env.example` points to the docker-compose network (host `db`).
# If you are running the backend locally on your host machine (not in Docker), update `.env` to point at `localhost` instead.
# Example for local DB: postgresql://postgres:postgres@localhost:5432/snwdb?schema=public

# NOTE: If running backend locally, ensure you are using Node.js >= 24. Older Node versions (e.g. 14) may fail due to modern JavaScript syntax used by Prisma.
## Generate prisma client
npm run prisma:generate
# Apply migrations (create schema)
# This will prompt a migration name; name something like 'init' or 'add_role'
npx prisma migrate dev --name init
# Seed some initial data
# Option A: Run seed locally (ensure .env > DATABASE_URL points to localhost)
npm run seed

# Option B: Run seed inside docker (works without changing DATABASE_URL):
docker-compose run --rm backend npm run seed

# Start the server
npm run dev
```

3. Frontend: install and run

```bash
cd frontend
npm install
# point the Vite dev server to the API with `.env` if needed
cp .env.example .env
npm run dev
# The front-end app runs at http://localhost:5173
```

## Running everything via Docker

In larger setups, you might containerize the backend and frontend. For now we provide the DB via docker-compose only.

To run everything (DB, backend and frontend) with Docker locally (builds backend and frontend images):

```bash
# from repo root
docker-compose up --build
```

- Backend GraphQL endpoint will be exposed on http://localhost:4000/graphql
- Frontend static site will be exposed on http://localhost:5173

New GraphQL endpoints / details:
 - `me` query returns current user and `role` (requires JWT auth)
 - Admin-only mutations: `createUser` (can set role) and `deleteUser`.
 - Manager capabilities: can read all users, create users (but not with role `ADMIN`) and update other users (but cannot delete or set `ADMIN` role).

The default sample users added by the seed script use 'password' for their password. You can login using:

 - alice@example.com / password
 - bob@example.com / password
 - carol@example.com / password
 - admin@example.com / password (admin role)
 - manager@example.com / password (manager role)

## GraphQL API

Start backend, and open GraphQL Playground at: `http://localhost:4000/graphql`.

Query examples:

```graphql
query GetUsers {
  users {
    id
    name
    email
    createdAt
  }
}
```

Mutations:

```graphql
mutation CreateUser {
  createUser(name: "New User", email: "new@user.com") {
    id
    name
  }
}
```

## Notes & Next steps

- Add authentication and authorization for a production-ready app.
  - A basic JWT-based authentication implementation is included. Use `/login` to get a token or register a user on `/register`. Tokens are stored in localStorage for the demo.
- Add tests and code-style checks (ESLint, Prettier).
- Containerize backend and frontend if desired.

Enjoy! 🚀
