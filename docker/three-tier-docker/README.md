# Three-Tier Docker Task Manager

A small task manager used to practice running a web application as three Docker services: a browser-facing frontend, a backend API, and a MySQL database.

## Architecture

| Tier | Service | What it does |
| --- | --- | --- |
| Frontend | Nginx | Serves `index.html`, `style.css`, and `script.js` on port 80. It forwards requests under `/api/` to the backend service. |
| Backend | Node.js and Express | Provides the task API on port 5000 and uses `mysql2` to query MySQL. |
| Database | MySQL 8 | Stores tasks in the `taskdb` database. `databases/init.sql` creates the `tasks` table on initial database setup. |

Compose connects the services on its internal network. The frontend reaches the API using the service name `backend`; the backend reaches MySQL using the hostname `db`. A named volume, `mysql-data`, stores MySQL data outside the database container.

## Run locally

Requirements: Docker Desktop (or Docker Engine) with the Docker Compose plugin.

From this directory, build and start the services:

```sh
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000) to use the task manager. The backend is also published on port 5000, so its status endpoint is at [http://localhost:5000](http://localhost:5000). MySQL is not published to a host port.

To stop the services, press `Ctrl+C`, then run:

```sh
docker compose down
```

The named database volume remains when containers are stopped or removed, so tasks persist across normal restarts. To remove the database data as well, use `docker compose down --volumes`; this permanently deletes the stored tasks.

## API

The frontend calls these endpoints through Nginx:

| Method | Path | Behavior |
| --- | --- | --- |
| `GET` | `/api/tasks` | Returns the task rows as JSON. |
| `POST` | `/api/tasks` | Creates a task from a JSON body such as `{"title":"Learn Docker Compose"}`. Returns `400` if the title is missing and `201` on success. |

The backend also provides `GET /` as a simple status response. The current application supports listing and adding tasks; it does not yet implement editing, completion, or deletion.

## Useful commands

Run these from this directory:

```sh
docker compose ps
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f db
```

## Startup and data notes

- Compose's `depends_on` sets startup order; it does not wait until MySQL is ready to accept connections. If the backend logs a connection error during the first startup, inspect the service logs and retry after MySQL is ready.
- MySQL runs `databases/init.sql` when it initializes an empty data directory. Because the named volume preserves that directory, changing the SQL file does not rerun initialization for an existing volume.
- The sample MySQL root password and database connection settings are hard-coded for local practice. Use secrets or environment-based configuration and a restricted database user before deploying beyond a local learning environment.
- The Compose file publishes the backend directly on port 5000 for local access, as well as exposing the frontend on port 3000.

## What this project practices

This project gave me experience building separate frontend and backend images, routing API requests through Nginx, connecting containers by Compose service names, defining a MySQL schema, and persisting data in a named volume. It also demonstrates how a single feature flows through all three tiers: the browser sends a request, Express handles it, and MySQL stores or returns the task.