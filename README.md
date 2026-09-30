# pokedex-frontend

React + Vite SPA for browsing the [pokedex-backend](https://github.com/renzo-ezagui/pokedex-backend)
REST API — a list view (search + type filter, paginated) and a detail view
(stats, localized names, artwork) for 809 Pokemon.

## Local dev

```bash
npm install
cp .env.example .env   # set VITE_API_URL to wherever pokedex-backend is running
npm run dev             # :5173
```

## Build

`VITE_API_URL` is inlined into the JS bundle at build time (Vite convention) — set
it as a Docker build arg, not a runtime env var.

```bash
npm run build
npm run preview
```

## Docker

```bash
docker build --build-arg VITE_API_URL=http://pokedex-api.lan -t pokedex-frontend .
docker run -p 8080:80 pokedex-frontend
```
