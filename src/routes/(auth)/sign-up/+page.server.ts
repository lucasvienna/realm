import type { Player } from "$lib/server/auth";

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
	default: async ({ request }) => {
		const formData = await request.formData();
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

		const api = getApi();
		return await api
			.post("register", {
				json: { username, password, email },
			})
			.json<RegisterResponse>()
			.then((res) => {
				console.info(`${res.status}: ${res.message}`);
				return redirect(303, "/account");
			})
			.catch((e: unknown) => {
				// this can be either an HTTPError or a JSON parsing error
				if (isRedirect(e)) throw e;

				if (e instanceof SyntaxError) {
					// we failed to parse JSON, but the response was 2xx
					return redirect(303, "/account");
				}

				invariant(e instanceof HTTPError, "ky should always return HTTPError");
				const {
					name,
					message,
					response: { status },
				} = e;
				console.error(`Error during registration\n    [${status}] ${name}: ${message}`);
				return fail(500, { message, username, email, termsAccepted });
			});
	},
};

interface RegisterResponse {
	status: string;
	message: string;
	user: Player;
}
