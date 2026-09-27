# Docker Learning Projects

This repository contains hands-on exercises I made while learning Docker and containerizing web applications.

## What I learned

- How to build images from Dockerfiles and use instructions such as `FROM`, `WORKDIR`, `COPY`, `RUN`, `EXPOSE`, `USER`, `ENV`, and `LABEL`.
- How containers can run a static website or a small Node.js HTTP server.
- How Docker Compose connects separate services, and how a persistent volume keeps database data between container runs.
- How a browser frontend, an API, and a database can work together as a three-tier application.

## Projects

- `practice/`: experiments with Dockerfile instructions, Nginx, copied files, users, and image metadata.
- `my-node-app/`: a Node.js HTTP server that reads `message.txt` and returns its contents.
- `three-tier-docker/`: a task manager with an Nginx frontend, an Express API, and a MySQL database. See its [README](three-tier-docker/README.md) for setup and architecture details.

These projects gave me practical experience writing Dockerfiles, building and running containers, mapping ports, and connecting services. They are learning projects, so some settings (including sample database credentials) are for local development and should be changed before real deployment.