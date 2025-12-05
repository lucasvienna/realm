import { requireLogin, type Player } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const user = requireLogin();
	return { user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		const res = await event.fetch("/api/logout", {
			method: "POST",
		});
		if (!res.ok) {
			const body = await res.json();
			return fail(400, { message: body.message });
		}
		event.locals.user = null;
		event.locals.session = null;
		event.cookies.delete("rsession", { path: "/" });

		return redirect(302, "/");
	},

	join_faction: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		const formData = await event.request.formData();
		const factionId = formData.get("faction");

		if (!factionId || typeof factionId !== "string") {
			return fail(400, { message: "Invalid faction ID" });
		}

		try {
			const res = await event.fetch("/api/player/faction", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ faction: factionId }),
			});
			if (!res.ok) {
				const body = await res.text();
				return fail(400, { success: false, message: body });
			}
			try {
				const usr: Player = await res.json();
				event.locals.user = usr;
			} catch (error) {
				console.error("Error parsing user data:", error);
				event.locals.user = null;
			}
			return { success: true };
		} catch (error) {
			return fail(500, { success: false, cause: error });
		}
	},
};
