# Computer Science

A personal learning workspace for full-stack web development. The repository is organized as independent experiments rather than one deployable application. Most folders have their own `package.json`, dependencies, and entry points.

## Projects and topics

| Folder | What to explore |
| --- | --- |
| [API](./API) | A `json-server` REST API backed by `db.json`. |
| [Authentication](./Authentication) | Express, MongoDB, password hashing, JWT registration, and request logging. |
| [Express JS](./Express%20JS) | Express routes, middleware, static files, EJS, and file-handling practice. |
| [MongoDB](./MongoDB) | Mongoose models, an employee generator, and Todo persistence examples. |
| [Node js](./Node%20js) | Node core modules, HTTP servers, Express/MongoDB examples, and a full-stack Todo app. |
| [REACT JS](./REACT%20JS) | React component, form, router, state, and API-learning exercises. |
| [nextjs](./nextjs) | A Next.js App Router blog UI using JSONPlaceholder posts and cached server data. |
| [Prisma](./Prisma) | Prisma Client with PostgreSQL, migrations, relations, and a small Express API. |
| [Socket.io](./Socket.io) | A React client and Socket.IO server that broadcast multiplayer scores. |
| [SQL-Practice-Projects](./SQL-Practice-Projects) | Five PostgreSQL schema and query exercises. |
| [TypeScript](./TypeScript) | TypeScript language exercises and a React + TypeScript UI. |
| [Websockets](./Websockets) | Native WebSocket messaging with Redis pub/sub fan-out. |
| [monorepo](./monorepo) | A Turborepo workspace and a separate lightweight client/server monorepo. |

## General workflow

1. Change into the project directory described by its README.
2. Install dependencies with `npm install` (or `pnpm install` for `monorepo/Monorepo`).
3. Create the required `.env` values before starting database-backed projects.
4. Run the local `dev`, `start`, or project-specific command.

These projects are intentionally small and may contain incomplete routes, hard-coded examples, or learning-only security choices. Treat each README as the source of truth for that folder.
