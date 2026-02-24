# LLLLM (Lame Local LLM)

Local Ollama web interface built with React, Vite, and Tailwind. Intended as a simple chat UI for models running via the Ollama HTTP API.

## Motivation

Learning React/Vite/Tailwindcss/etc. while building something somewhat useful.

## Prerequisites

- **Ollama** installed and running locally (`ollama serve`) for development
  - Download and install from the official site, then run the daemon.
- **Node.js** v18+ (Node 20 recommended)
- **npm** (comes with Node)
- **Docker** and **Docker Compose** (only required if you want to use the Docker setup)

## Development (local, no Docker)

This mode assumes **Ollama is installed and running locally** on the same machine.

1. Install dependencies:

   ```bash
   npm i
   ```

2. Start Ollama (if not already running):

   ```bash
   ollama serve
   ```

3. Rename '.env.development.example' file to '.env.development':

   ```bash
   mv .env.development.example .env.development
   ```

4. Start the Vite dev server:

   ```bash
   npm run dev
   ```

5. Open the app in your browser (usually `http://localhost:5173`).

## Running with Docker Compose

This mode runs **both** the frontend and Ollama in containers.

1. Build and start the stack:

   ```bash
   docker-compose up -d
   ```

2. Open the app on the same machine:

   ```text
   http://localhost:1111
   ```

3. From another device on the same network, use your machine’s LAN IP:

   ```text
   http://<your-ip>:1111
   # e.g. http://192.168.1.2:1111
   ```

### Pulling a model inside the Ollama container

By default, no model is pulled. To download a model (for example `llama3.2`) **inside the Docker container**, run:

```bash
docker exec -it ollama ollama pull llama3.2
```

You only need to do this once per model; subsequent restarts will reuse the downloaded model data from the `ollama` volume.

### Rebuilding after code changes (Docker)

If you change frontend code and want Docker to use the new build:

```bash
docker compose build llllm
docker compose up -d
```
