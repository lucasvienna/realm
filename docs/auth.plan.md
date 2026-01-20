# Game Auth & Deployment Architecture

## Topology

```
                         ┌──────────────────────────────────────────┐
                         │           Docker Network                 │
Internet                 │                                          │
   │                     │  ┌───────────┐      ┌─────────────────┐  │
   ▼                     │  │ SvelteKit │      │  Rust Backend   │  │
┌────────┐   /*          │  │  :3000    │─────▶│  :8080          │  │
│ Caddy  │───────────────┼─▶│           │ int. │                 │  │
│        │   /api/*      │  └───────────┘      └─────────────────┘  │
│        │───────────────┼─────────────────────────────▲            │
└────────┘               │                             │            │
                         └─────────────────────────────┼────────────┘
                                                  (public)
```

## Auth Flow

| Client | Auth Method     | Flow                                                          |
| ------ | --------------- | ------------------------------------------------------------- |
| Web    | HttpOnly cookie | `POST /api/auth/login` → backend sets cookie via Caddy        |
| Mobile | JWT             | `POST /api/auth/login?client=mobile` → backend returns tokens |

## Cookie Strategy

Auth requests (`/api/auth/*`, `/api/login`, `/api/register`, `/api/logout`) go
through the **public proxy** so `Set-Cookie` headers reach the browser via
SvelteKit's `event.fetch` auto-forwarding.

All other API calls from SvelteKit server-side use **internal routing** with
manual cookie forwarding for performance (bypasses load balancer).

## Environment Variables

```bash
# Server-only: Direct container-to-container URL (bypasses load balancer)
# Dev: http://localhost:8080 | Prod: http://backend:8080
API_INTERNAL_URL=http://localhost:8080
```

## Implementation

### SvelteKit Hooks

```typescript
// src/hooks.server.ts
import { env } from "$env/dynamic/private";
import * as auth from "$lib/server/auth";

const AUTH_ENDPOINTS = ["/api/auth/", "/api/login", "/api/register", "/api/logout"];

function isAuthEndpoint(pathname: string): boolean {
	return AUTH_ENDPOINTS.some((ep) => pathname.startsWith(ep));
}

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	const url = new URL(request.url);

	// Auth endpoints: pass through unchanged (same-origin, cookies auto-forwarded)
	if (isAuthEndpoint(url.pathname)) {
		return fetch(request);
	}

	// Other /api/* requests: rewrite to internal backend URL
	if (url.pathname.startsWith("/api/")) {
		const internalPath = url.pathname.replace(/^\/api/, "");
		const internalUrl = new URL(internalPath, env.API_INTERNAL_URL ?? "http://localhost:8080");
		internalUrl.search = url.search;

		const headers = new Headers(request.headers);
		const session = event.cookies.get(auth.SESSION_COOKIE);
		if (session) {
			headers.set("Cookie", `${auth.SESSION_COOKIE}=${session}`);
		}

		return fetch(
			new Request(internalUrl, {
				method: request.method,
				headers,
				body: request.body,
				duplex: "half",
			} as RequestInit),
		);
	}

	return fetch(request);
};
```

### Load Functions

```typescript
// src/routes/dashboard/+page.server.ts
export async function load({ fetch }) {
	// Uses internal routing via handleFetch
	const res = await fetch("/api/user");
	return { user: await res.json() };
}
```

### Caddy Config (Production)

```caddyfile
game.example.com {
    handle /api/* {
        reverse_proxy backend:8080
    }
    handle {
        reverse_proxy sveltekit:3000
    }
}
```

## Local Development

Vite dev server proxies `/api/*` to `http://localhost:8080` (configured in
`vite.config.ts`).

```yaml
# docker-compose.yml (optional, for local prod-like testing)
services:
  backend:
    build: ./backend
    ports: ["8080:8080"]

  web:
    build: ./web
    ports: ["3000:3000"]
    environment:
      - API_INTERNAL_URL=http://backend:8080
```

## Migration Notes

1. Auth actions (`sign-in`, `sign-up`) use `getApi()` which routes through
   `handleFetch`. Auth endpoints are passed through the proxy for cookie
   forwarding.
2. Non-auth API calls use `getApi()` which routes internally via `handleFetch`
   (bypasses load balancer).
3. The `rsession` cookie name is defined in `src/lib/server/auth.ts`
