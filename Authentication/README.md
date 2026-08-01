# Authentication

An Express and MongoDB authentication exercise centered on user registration. It demonstrates JSON request parsing, Morgan logging, Mongoose models, SHA-256 password hashing, and JWT creation.

## Request flow

`server.js` connects to MongoDB, mounts the router at `/api/auth`, and listens on port `5000` by default. The current route is:

```text
POST /api/auth/register
```

Send `{ "username": "samir", "email": "samir@example.com", "password": "secret" }`. The controller checks for an existing username or email, stores a hash, and returns a one-day JWT.

## Run locally

Create `.env` with:

```env
MONGO_URI=mongodb://[REDACTED]
JWT_SECRET=replace-with-a-development-secret
PORT=5000
```

Then run:

```bash
npm install
npm run dev
```

The root health response is available at `GET /`. This is a learning implementation: login, token middleware, validation, and production-grade password hashing still need to be added before real use.
