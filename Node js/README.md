# Node.js practice

This folder collects Node.js fundamentals and several small backend/frontend exercises. It is organized by the concept being studied rather than as one application.

## Areas

- `Node js/Basics` — modules, text files, and introductory Node APIs.
- `Node js/Server` — native HTTP servers, URL/path handling, streams, events, forms, CRUD-style file work, and a small API.
- `Express js` — Express routes, middleware, EJS views, MVC-style files, and a JSON user example.
- `MongoDB` — MongoDB/Mongoose connections, cookies, sessions, CORS, file uploads, email, and student views.
- `To-Do-List` — a React/Vite frontend with an Express/MongoDB backend, JWT cookies, bcrypt passwords, rate limiting, and task CRUD.
- `React Frontend/testing frontend` — a tiny client that fetches and logs the root response from a backend on port `3000`.

## Running examples

Each nested project has its own `package.json`. Change into that project before installing dependencies, for example:

```bash
cd "Node js/To-Do-List/frontend"
npm install
npm run dev
```

The Todo backend requires MongoDB and environment values for its database, JWT secret, and client URL. Individual source files in the fundamentals folders are intended to be run one at a time; check their imports and port numbers before starting more than one server.
