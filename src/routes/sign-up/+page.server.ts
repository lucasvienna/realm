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
		const email = formData.get("email");
		const username = formData.get("username");
		const password = formData.get("password");
		const passwordConfirm = formData.get("confirm-password");
		const termsAccepted = formData.get("terms") === "on";

		if (!email) {
			return fail(400, { username, email, missing: true });
		}

		if (password !== passwordConfirm) {
			return fail(400, { username, email, termsAccepted, mismatch: true });
		}

		if (!termsAccepted) {
			return fail(400, { username, email, disagreed: true });
		}

		try {
			const res = await event.fetch("/api/register", {
				method: "POST",
				body: JSON.stringify({ username, password, email }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({
					error: "Registration failed",
				}));
				return fail(400, { message: body.error, username, email, termsAccepted });
			}
		} catch (e) {
			console.error("Error during registration:", e);
			return fail(500, { message: "An error has occurred", username, email, termsAccepted });
		}
		return redirect(302, "/account");
	},
};
