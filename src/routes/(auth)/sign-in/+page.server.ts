import { getApi } from "$lib/server/api";
import { fail, isRedirect, redirect } from "@sveltejs/kit";
import { HTTPError } from "ky";
import invariant from "tiny-invariant";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(307, "/account");
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get("username");
		const password = formData.get("password");
		const remember = formData.get("remember") === "on";

		const api = getApi();
		return await api
			.post("login", {
				json: { username, password, remember },
			})
			.then(() => redirect(303, "/account"))
			.catch(async (e) => {
				if (isRedirect(e)) throw e;

				invariant(e instanceof HTTPError, "ky didn't return HTTPError");
				const body = await e.response.json().catch(() => ({ error: "failed to parse error body" }));
				console.warn("Login failed:", body);
				return fail(e.response.status, {
					message: body.error || "Invalid credentials",
					username,
					remember,
				});
			});
	},
};
