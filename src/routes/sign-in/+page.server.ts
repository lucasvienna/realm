import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, "/account");
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get("username");
		const password = formData.get("password");
		const remember = formData.get("remember") === "on";

		const res = await event.fetch("/api/login", {
			method: "POST",
			body: JSON.stringify({ username, password, remember }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (res.status !== 200) {
			const body = await res.clone().json();
			console.warn("Login failed:", body);
			return fail(res.status, { message: body.error || "Invalid credentials", username, remember });
		}

		return redirect(302, "/account");
	},
};
