# CLAUDE.md — pokedex-frontend

React + Vite SPA — Pokedex list (search + type filter, paginated) and detail view
(stats, localized names, artwork), consuming the
[`pokedex-backend`](https://github.com/renzo-ezagui/pokedex-backend) REST API.

## Stack

React 18, TypeScript, Vite, react-router-dom. `VITE_API_URL` is inlined into the
bundle at Docker build time (Vite convention — it's a build arg, not a runtime env
var). No state management library — two pages, plain `useState`/`useEffect`.

## URL local

`http://pokedex.lan` — Coolify app, Traefik-routed (existing `*.lan` wildcard)

## URL pública

`https://pokedex.ezagui.dev` (Cloudflare Tunnel `homelab-dashboard`)

## Deploy — Coolify

Project `pokedex` (uuid `5y2ecwnybhakouc3kpuotbhf`), app uuid
`qaz0nymagqc7co9cle6ub8vy`, `dockerfile` build pack, created via the `public` repo
flow (repo is public — see backend CLAUDE.md's "Repo visibility" for why). Build arg
`VITE_API_URL=https://pokedex-api.ezagui.dev` (the PUBLIC backend URL, over
**https**, not the internal `http://pokedex-api.lan` Coolify domain) — `fetch()`
runs in the visitor's browser, not inside Docker, so it needs an address reachable
from outside the homelab network, and since the frontend itself is served over
https (TLS terminates at Cloudflare's edge) an http:// fetch target would be
blocked as mixed content. This means the deployed frontend always talks to the
backend over the public tunnel, even for LAN-local visitors — acceptable for this
project's scale. Set via `coolify app env create qaz0nymagqc7co9cle6ub8vy --key
VITE_API_URL --value https://pokedex-api.ezagui.dev --build-time --runtime=false`
(build-time only — it's inlined into the bundle, not needed at container runtime).

```bash
coolify app deploy qaz0nymagqc7co9cle6ub8vy
coolify app logs qaz0nymagqc7co9cle6ub8vy
```

### Caddy vhost (public domain)

Same note as backend CLAUDE.md — `pokedex.ezagui.dev` needed an explicit vhost added
to `services/caddy/Caddyfile` (the `*.lan` wildcard doesn't cover it).

## Skills recomendadas

- `frontend-design` — dirección visual/tipografía si se rediseña la UI
- `caveman` / `cavecrew` — builder/investigator/reviewer para cambios de código

## Cómo trabajar aquí

Ver `references/working-conventions.md` en la skill `homelab-new-project`. Resumen:

- Claude no commitea ni hace deploy sin autorización explícita
- Crear branch antes de modificar: `git checkout -b feat/<descripcion>`
- Backend (`pokedex-backend`) primero si el cambio afecta qué datos se muestran
