# Qortex Backend Skeleton

This directory now hosts the Phase 1 backend for Qortex: an Express + TypeScript service wired to Postgres, Redis/BullMQ, miner registration, deterministic task dispatch, quorum validation, and SSE event streaming.

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

# execute unit tests (Vitest)
npm test
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

### Environment variables

| Name | Description |
| --- | --- |
| `API_KEY_SECRET` | Required header (`x-api-key`) for `/api/v1/tasks` |
| `MINER_SHARED_SECRET` | Shared HMAC secret used by miner simulators when posting results |
| `DISPATCH_REPLICAS` | Miner count per microtask (default 5) |
| `RESULT_TIMEOUT_MS` | Max age for miner timestamps (default 30s) |
| `QUORUM_CHECK_INTERVAL_MS` | Reserved for periodic quorum sweeps (default 5s) |
| `MAX_TWEETS_PER_TASK` | Upper bound on tweet batch submissions (default 5) |

### Docker workflow

```bash
# build containers and start postgres + redis + backend
docker-compose up --build
```

The dev container mounts the `src` directory to enable live editing.

## Project Structure

- `src/server.ts` – Express bootstrap + route mounting
- `src/routes/taskRoutes.ts` – Task submission & status (API-key protected)
- `src/routes/minerRoutes.ts` – Miner registration
- `src/routes/internalRoutes.ts` – Miner result ingestion
- `src/routes/eventRoutes.ts` – SSE stream for UI/miners
- `src/controllers/*.ts` – HTTP controllers
- `src/middleware/apiKey.ts` – API key guard for client endpoints
- `src/services/taskManager.ts` – Prisma-backed task creation + queue enqueueing
- `src/services/dispatcher.ts` – BullMQ worker for microtask assignment
- `src/services/minerService.ts` – Miner registry helpers
- `src/services/resultService.ts` – Miner HMAC validation + persistence
- `src/services/quorumValidator.ts` – Majority/quorum logic + task finalization
- `src/queue/microtaskQueue.ts` – BullMQ queue definition
- `src/events/eventBus.ts` – Event emitter powering SSE
- `src/services/*.test.ts` – Vitest coverage for core logic
- `src/config/*` – env/Prisma/Redis singletons
- `prisma/schema.prisma` – relational schema backing the service

### API quick reference

- `POST /api/v1/tasks` – submit tweets (header `x-api-key`)
- `GET /api/v1/tasks/:taskId` – retrieve task status + microtask breakdown
- `GET /api/v1/events` – SSE stream (optional `taskId`/`minerId` filters)
- `POST /api/v1/miners/register` – register simulated miners
- `POST /internal/miner/:minerId/result` – miners submit signed outputs

Events emitted over SSE:
- `task.created`
- `microtask.assigned`
- `microtask.result`
- `microtask.quorum`
- `task.completed`

Future phases will add proof generation, payments, miner simulators, real-time dashboard UI, and full integration tests.
