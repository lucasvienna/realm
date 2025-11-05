import { requireLogin, type Player } from "$lib/server/auth";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
	const user = requireLogin();
	return { user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		const res = await event.fetch("/api/logout");
		if (res.status !== 200) {
			const body = await res.json();
			return fail(400, { message: body.message });
		}
		event.locals.user = null;
		event.locals.session = null;

		return redirect(302, "/login");
	},

	join_faction: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		const formData = await event.request.formData();
		const factionId = formData.get("faction");
		console.log("Joining faction:", factionId);

		if (!factionId || typeof factionId !== "string") {
			return fail(400, { message: "Invalid faction ID" });
		}

		const res = await event.fetch("/api/player/faction", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ faction: factionId }),
		});
		if (res.status !== 200) {
			const body = await res.text();
			return fail(400, { message: body });
		}
		try {
			const usr: Player = await res.json();
			event.locals.user = usr;
		} catch (error) {
			console.error("Error parsing user data:", error);
			event.locals.user = null;
		}
		return { success: true };
	},
};
