import { getRequestEvent } from "$app/server";
import { redirect, type RequestEvent } from "@sveltejs/kit";

export const SESSION_COOKIE = "rsession";

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
	const res = await event.fetch("/api/session", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const body: AuthResponse = await res.json();
	if (res.status !== 200) {
		throw new Error("Session token validation failed");
	}
	const { player, session } = body;
	if (!player || !session) {
		throw new Error("Session token validation failed");
	}
	if (session.token !== sessionToken) {
		throw new Error("Session token validation failed");
	}
	return {
		player,
		session,
	};
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
		return redirect(302, "/sign-in");
	}

	return locals.user;
}
