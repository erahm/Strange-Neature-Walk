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
- GraphiQL UI: http://localhost:4000/graphiql

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

- Migrations live in `backend/prisma/migrations/`. Keep this directory in source control and rely on `npx prisma migrate dev` (local).
- The startup script in Docker runs migrations with `npx prisma migrate deploy || npx prisma db push`, followed by the seeding script `node prisma/seed.js`.

Create a new migration after editing the schema:

```bash
cd backend
npx prisma migrate dev --name add_field
```

---

## Authentication & seeded users

- The backend uses JWT for authentication and CASL for authorization.
- Dev seeding creates a set of sample users with `password` as the password:

- bob@example.com / password (VIEWER)
- manager@example.com / password (MANAGER)
- admin@example.com / password (ADMIN)

---

## Notes and Considerations

- I didn't end up creating any field level authz rules in the API
  - Given a bit more time and better knowledge of CASL I would redact certain data from Users in the API response. That data is redacted in the UI but a savvy user could inspect the network call and find that data.
- I got a little distracted and spent some time setting up GraphiQL and ESLint
  - This turned out to be useful but it wasn't necessary.
- Several people asked me during interviews if I've ever used generative AI, so I decided to try using AI to scaffold the application for me but that ended up taking longer to get right than it probably would have taken me to just do it by hand.
  - CoPilot seemed okay at setting up Docker once I had basically changed the entire intial monorepo structure.
  - I tried to have CoPilot write a few basic unit tests but it kept writing tests and then trying to change the actual logic to make those tests pass instead of writing tests that covered the existing logic.
- Given more time I would like to:
  - create an Audit table to capture the before and after as well as UserId and event time on all Create/Update/Delete events.
  - Make it pretty. I added enough styling to make it usable but it's ugly. I started off just using `styles.css` and about halfway through decided to bring in `styled-components` to scope styles to elements and speed up development. When working on a small project by myself or a small team, `styles.css` is managable but doesn't scale well as the project and team grows.

- There's a bug where if you log in as either a manager or admin, go to an exhibit and then log out, you'll still see the `edit` button and can enter edit mode. This is due to me not resetting the `isAdmin` and `isManager` variables but I decided to leave this bug in because it shows that the authz check through CASL is working by notifying the user that they lack the permissions to perform that action and then not allowing that action to go through.