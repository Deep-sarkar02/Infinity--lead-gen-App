# Docker

Local and production use the same `docker-compose.yml`.

## Quick start

```bash
cp .env.example .env   # fill in secrets
docker compose up --build -d
```

- **Production:** `APP_PORT=80` → http://your-server  
- **Local:** set `APP_PORT=8081` if port 80 is in use  

## Architecture

```
Browser
    │
    ▼
frontend (nginx :80)  ──/api/*──►  backend (:3001, internal)
                                        │
                                        ▼
                                   MongoDB Atlas
```

## Commands

| Command | Description |
|---------|-------------|
| `docker compose up --build -d` | Build and start |
| `docker compose ps` | Status |
| `docker compose logs -f` | Follow logs |
| `docker compose down` | Stop |

Production checklist: [DEPLOY.md](./DEPLOY.md)
