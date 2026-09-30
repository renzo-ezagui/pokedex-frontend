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

Project `pokedex`, app uuid `PENDING`, `dockerfile` build pack. Build arg
`VITE_API_URL=https://pokedex-api.ezagui.dev` (the PUBLIC backend URL, over
**https**, not the internal `http://pokedex-api.lan` Coolify domain) — `fetch()`
runs in the visitor's browser, not inside Docker, so it needs an address reachable
from outside the homelab network, and since the frontend itself is served over
https (TLS terminates at Cloudflare's edge) an http:// fetch target would be
blocked as mixed content. This means the deployed frontend always talks to the
backend over the public tunnel, even for LAN-local visitors — acceptable for this
project's scale.

```bash
coolify app deploy PENDING
coolify app logs PENDING
```

## Skills recomendadas

- `frontend-design` — dirección visual/tipografía si se rediseña la UI
- `caveman` / `cavecrew` — builder/investigator/reviewer para cambios de código

## Cómo trabajar aquí

Ver `references/working-conventions.md` en la skill `homelab-new-project`. Resumen:

- Claude no commitea ni hace deploy sin autorización explícita
- Crear branch antes de modificar: `git checkout -b feat/<descripcion>`
- Backend (`pokedex-backend`) primero si el cambio afecta qué datos se muestran
