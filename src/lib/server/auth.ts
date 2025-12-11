import { getRequestEvent } from "$app/server";
import { API_PREFIX } from "$lib/constants";
import { redirect, type RequestEvent } from "@sveltejs/kit";
import ky from "ky";

export const SESSION_COOKIE = "rsession";
const SESSION_VALIDATION_ERROR = "Session token validation failed";

export interface Player {
	id: string;
	name: string;
	email: string | null;
	faction: string;
}

export interface Session {
	token: string;
	expires_at: string;
}

interface AuthResponse {
	player: Player;
	session: Session;
}

export async function validateSessionToken(
	event: RequestEvent,
	sessionToken: string,
): Promise<AuthResponse> {
	const api = ky.create({
		fetch: event.fetch,
		prefixUrl: `${event.url.origin}${API_PREFIX}`,
	});

	const body = await api
		.get("session")
		.json<AuthResponse>()
		.catch(() => {
			throw new Error(SESSION_VALIDATION_ERROR);
		});

	const { player, session } = body;
	if (!player || !session) {
		throw new Error(SESSION_VALIDATION_ERROR);
	}
	if (session.token !== sessionToken) {
		throw new Error(SESSION_VALIDATION_ERROR);
	}
	return { player, session };
}

/**
 * Ensures that a user is logged in before proceeding.
 *
 * This function retrieves the current request event and checks if a user is present in `locals`.
 * If no user is found, it redirects the client to the sign-in page.
 * Otherwise, it returns the authenticated user.
 *
 * @returns The authenticated user.
 * @throws Redirects to '/sign-in' if the user is not authenticated.
 */
export function requireLogin(): Player {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(307, "/sign-in");
	}

	return locals.user;
}
