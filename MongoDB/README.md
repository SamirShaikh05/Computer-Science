# MongoDB

MongoDB practice using both the MongoDB driver and Mongoose. The examples cover connections, schemas, CRUD-style operations, views, and a small generated dataset.

## Examples

- `playground1.mongodb.js` contains MongoDB shell/query practice.
- `mongoose/` defines a `Todo` model and exposes a small Express app. `GET /` inserts a Todo and `GET /abc` reads one Todo.
- `Project/` connects to the local `company` database, renders an EJS home page, and regenerates ten random employees at `GET /employee`.

## Run the Mongoose examples

Start MongoDB locally, then run the example from its own directory:

```bash
cd mongoose
npm install
npm run dev
```

The project examples use `mongodb://[REDACTED]` and `mongodb://[REDACTED]`. They are intentionally destructive in places—`Project/employee` deletes existing employees before inserting sample data.
