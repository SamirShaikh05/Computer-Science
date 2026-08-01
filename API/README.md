# API

A minimal REST API practice project using [`json-server`](https://github.com/typicode/json-server). The server exposes the records in `db.json` as HTTP endpoints without a custom Express application.

## Data model

`db.json` contains a `users` collection with `name`, `age`, and `email` fields. JSON Server also supplies an `id` for each record.

## Run it

```bash
npm install
npx json-server db.json
```

The default server is available at `http://localhost:3000`. Useful requests include:

```text
GET    /users
GET    /users/:id
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

Changes are written back to `db.json`, making this folder useful for practicing frontend data fetching and CRUD requests.
