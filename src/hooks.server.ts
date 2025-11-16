import { paraglideMiddleware } from "$lib/paraglide/server";
import * as auth from "$lib/server/auth.js";

import type { Handle } from "@sveltejs/kit";

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
