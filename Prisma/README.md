# Prisma

Prisma 7 practice with PostgreSQL, the `@prisma/adapter-pg` driver adapter, TypeScript, and Express. The project has a migration history covering users, ages, IDs, blogs, categories, and relations.

## API example

`server.ts` listens on port `3000` and exposes:

- `GET /` — health response.
- `GET /new-user` — creates a sample user with Prisma Client.
- `GET /add` — connects category `1` to blog `1` to demonstrate a relation update.

## Setup

Provide a PostgreSQL connection string in `.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE
PORT=3000
```

Then run:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

`npm run studio` opens Prisma Studio. Review `prisma/schema.prisma` and the migration files before using the sample mutation routes against shared data.
