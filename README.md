# Introscribe

## Running With Docker

Prereqs: [Docker Desktop](https://docs.docker.com/desktop/) installed and running.

```bash
# Build the production image and start nginx on port 8080
docker compose up --build
```

The site becomes available at http://localhost:8080. Use `docker compose down` to stop the container.
