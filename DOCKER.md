# Docker Development Guide

Run the Gemini CLI OpenAI Server locally in Docker — **no Cloudflare account or dependencies required**.

## Prerequisites

- Docker and Docker Compose installed
- A `.env` file with your environment variables (copy from `.env.example`)

## Quick Start

1. **Create your environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual OAuth2 credentials
   ```

2. **Start the server:**
   ```bash
   npm run docker:dev
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:8787/health
   curl http://localhost:8787/v1/models
   ```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run docker:build` | Build the Docker image |
| `npm run docker:dev` | Build and start with logs |
| `npm run docker:start` | Start existing containers |
| `npm run docker:stop` | Stop running containers |
| `npm run docker:clean` | Stop containers and clean up |
| `npm run docker:logs` | View container logs |
| `npm run docker:shell` | Open a shell inside the container |

## How It Works

- **Runtime**: Node.js 20 (no Cloudflare Workers or miniflare)
- **Framework**: Hono with `@hono/node-server`
- **Token Cache**: In-memory (tokens auto-refresh, no persistence needed)
- **Hot Reload**: Source code is mounted into the container

## Local Development (without Docker)

```bash
# Install dependencies
npm install

# Create .env from example
cp .env.example .env

# Start development server with hot reload
npm run dev
```

## Environment Variables

Configured in your `.env` file. See `.env.example` for all available options.

**Required:**
- `GCP_SERVICE_ACCOUNT` — OAuth2 credentials JSON from Gemini CLI

**Optional:**
- `OPENAI_API_KEY` — API key for authentication
- `PORT` — Server port (default: 8787)
- `ENABLE_REAL_THINKING` — Enable Gemini's native reasoning
- See `.env.example` for the full list

## Troubleshooting

### Container Won't Start

1. Check Docker is running: `docker --version`
2. Check for port conflicts: `lsof -i :8787`
3. View detailed logs: `docker-compose up --build`

### Environment Variables Not Working

1. Verify `.env` exists: `ls -la .env`
2. Check format: no spaces around `=`, JSON values on one line
3. Inspect inside container: `npm run docker:shell` then `env`

### Authentication Errors

1. Ensure OAuth2 credentials are valid and not expired
2. Check the debug endpoint: `curl http://localhost:8787/v1/debug/cache`
3. Test authentication: `curl -X POST http://localhost:8787/v1/token-test`
