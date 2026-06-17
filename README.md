# TaskForge

**Build. Focus. Execute.**

TaskForge is a premium Neo-Brutalism 2.0 productivity operating system for students, developers, startup founders, creators, freelancers, and ambitious professionals.

## Stack
- React + Vite + Framer Motion
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Vercel-ready serverless API adapter

## Quick start
```bash
cp .env.example .env
npm install
npm run dev
```

## Environment variables
- `MONGODB_URI` - MongoDB connection string. Required locally and on Vercel.
- `JWT_SECRET` - long random secret for signing auth tokens. Required locally and on Vercel.
- `CLIENT_ORIGIN` - optional comma-separated list of allowed frontend origins.
- `PORT` - local API port, defaults to `5000`.

## Why Vercel may not work without this setup
Vercel does not run a long-lived Express server from `server/src/index.js` for frontend deployments. It expects static assets in `dist/` and serverless functions in `api/`. This project includes:

- `vercel.json` to build Vite, serve `dist/`, route `/api/*` to the serverless adapter, and route frontend paths to `index.html`.
- `api/index.js` to adapt the Express app to a Vercel serverless function.
- `server/src/app.js` so the Express app can be imported by Vercel without calling `listen()`.

In the Vercel dashboard, add `MONGODB_URI` and `JWT_SECRET` before deploying. If these are missing, API routes intentionally fail fast instead of running without a database or auth secret.

## API routes
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/duplicate`
- `GET /api/categories`
- `POST /api/categories`
- `PATCH /api/categories/:id`
- `DELETE /api/categories/:id`
- `GET /api/analytics/summary`

## Deployment guide
1. Create a MongoDB Atlas cluster and copy the connection URI.
2. In Vercel project settings, add `MONGODB_URI` and `JWT_SECRET`.
3. Keep the framework preset as Vite or use the included `vercel.json`.
4. Deploy. Vercel runs `npm run build`, serves `dist/`, and maps `/api/*` to `api/index.js`.
5. Confirm `/api/health` returns `{ "ok": true, "name": "TaskForge" }`.

## Production notes
- The frontend currently includes a polished local demo workspace and auth UI; connect it to `/api/auth/*` and `/api/tasks` for persisted multi-user data.
- Protected API routes require `Authorization: Bearer <token>`.
- The MongoDB models include Users, Tasks, Categories, and Activity Logs.
