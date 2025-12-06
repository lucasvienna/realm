import type { Handle, HandleFetch } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";
import { paraglideMiddleware } from "$lib/paraglide/server";
import * as auth from "$lib/server/auth";
import { sequence } from "@sveltejs/kit/hooks";

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace("%paraglide.lang%", locale),
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.SESSION_COOKIE);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	try {
		const { session, player } = await auth.validateSessionToken(event, sessionToken);

		event.locals.user = player;
		event.locals.session = session;
	} catch (_e) {
		event.locals.user = null;
		event.locals.session = null;
	}

	return resolve(event);
};

export const handle: Handle = async ({ event, resolve }) => {
	// Prevents infinite recursion when auth validation calls /api/session
	if (event.url.pathname.startsWith("/api")) {
		return resolve(event);
	}

	return sequence(handleParaglide, handleAuth)({ event, resolve });
};

/** Auth endpoint patterns that should go through the public proxy (for cookie forwarding). */
const AUTH_ENDPOINTS = ["/api/auth/", "/api/login", "/api/register", "/api/logout"];

/**
 * Check if a pathname is an auth endpoint that needs cookie forwarding.
 */
function isAuthEndpoint(pathname: string): boolean {
	return AUTH_ENDPOINTS.some((ep) => pathname.startsWith(ep));
}

/**
 * Handles fetch requests from server-side code (load functions, actions).
 *
 * - Auth endpoints (`/api/auth/*`, `/api/login`, `/api/register`, `/api/logout`):
 *   Pass through unchanged. These go through the public proxy (Vite in dev,
 *   nginx in prod), so `Set-Cookie` headers are automatically forwarded to
 *   the browser by `event.fetch`.
 *
 * - Other API endpoints (`/api/*`): Rewrite to internal backend URL for
 *   direct container-to-container communication (bypasses load balancer).
 *   Session cookie is manually forwarded.
 */
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
		if (session) headers.set("Cookie", `${auth.SESSION_COOKIE}=${session}`);

		return fetch(
			new Request(internalUrl, {
				method: request.method,
				headers,
				body: request.body,
			} satisfies RequestInit),
		);
	}

	return fetch(request);
};
