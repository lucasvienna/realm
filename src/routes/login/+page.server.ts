import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, "/account");
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
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
			console.error("Login failed:", body);
			return fail(res.status, { message: body.error || "Invalid credentials" });
		}

		return redirect(302, "/account");
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get("username");
		const password = formData.get("password");

		try {
			const res = await event.fetch("/api/register", {
				method: "POST",
				body: JSON.stringify({ username, password }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (res.status !== 200) {
				const body = await res.json();
				return fail(400, { message: body.error || "Registration failed" });
			}
		} catch (e) {
			console.error("Error during registration:", e);
			return fail(500, { message: "An error has occurred" });
		}
		return redirect(302, "/account");
	},
};
