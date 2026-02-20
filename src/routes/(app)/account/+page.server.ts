import type { FactionResponse } from "$lib/domain/faction";
import { getApi } from "$lib/server/api";
import { requireLogin, type Player } from "$lib/server/auth";
import { fail, isRedirect, redirect } from "@sveltejs/kit";
import { HTTPError } from "ky";
import invariant from "tiny-invariant";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const user = requireLogin();
	const api = getApi();
	const factions = await api.get("game/factions").json<Array<FactionResponse>>();
	return { user, factions };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		const api = getApi();
		return api
			.post("logout")
			.then(() => {
				event.locals.user = null;
				event.locals.session = null;
				event.cookies.delete("rsession", { path: "/" });
				return redirect(303, "/");
			})
			.catch(async (e) => {
				if (isRedirect(e)) throw e;

				invariant(e instanceof HTTPError, "ky didn't return HTTPError");
				const body = await e.response.json().catch(() => ({ message: "Logout failed" }));
				return fail(400, { message: body.message });
			});
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

		const api = getApi();
		return api
			.put("player/faction", { json: { faction: factionId } })
			.json<Player>()
			.then((usr) => {
				event.locals.user = usr;
				return { success: true };
			})
			.catch(async (e) => {
				if (e instanceof SyntaxError) {
					// JSON parsing failed but request succeeded
					console.error("Error parsing user data:", e);
					event.locals.user = null;
					return { success: true };
				}
				invariant(e instanceof HTTPError, "ky didn't return HTTPError");
				const body = await e.response.text();
				return fail(400, { success: false, message: body });
			});
	},
};
