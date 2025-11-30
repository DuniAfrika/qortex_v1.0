# Qortex Backend Skeleton

This directory hosts the Express + TypeScript bootstrap for the Qortex verification backend. It sets up the base routes, services, and local infrastructure (Postgres + Redis) used by the later MVP implementation.

## Requirements
- Node.js 20+
- npm 10+
- Docker & Docker Compose

## Getting Started

```bash
# install dependencies
npm install

# copy env template and adjust values as needed
cp .env.example .env

# start dev server with hot reload
npm run dev

# run TypeScript build
npm run build

# run compiled server
npm start
```

The API is available at `http://localhost:3000` with `/api/v1/tasks` routes.

## Database Schema (Prisma)

Prisma models for all core tables live in `prisma/schema.prisma`.

```bash
# generate Prisma client (after updating the schema)
npm run prisma:generate

# apply migrations to the Postgres instance defined by DATABASE_URL
npm run prisma:migrate -- --name init
```

By default, `.env.example` points to a local Postgres running on port 5432.

### Docker workflow

```bash
# build containers and start postgres + redis + backend
docker-compose up --build
```

The dev container mounts the `src` directory to enable live editing.

## Project Structure

- `src/server.ts` – Express bootstrap
- `src/routes/taskRoutes.ts` – REST routes for task CRUD
- `src/controllers/taskController.ts` – HTTP controllers
- `src/services/taskManager.ts` – placeholder task logic (to be replaced with DB + queue integration)
- `src/config/env.ts` – loads environment variables with sane defaults
- `src/config/prisma.ts` – Prisma client singleton
- `prisma/schema.prisma` – relational schema backing the service

Future steps include filling services, adding miners, quorum logic, proof generation, tests, and CI/CD automation.
