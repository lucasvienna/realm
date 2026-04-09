import ky, { type BeforeErrorState, isHTTPError } from "ky";

import { API_PREFIX } from "./constants";

/**
 * Extracts error message from the response body and enhances the error.
 */
async function extractErrorMessage({ error }: BeforeErrorState): Promise<Error> {
	if (isHTTPError(error)) {
		const body: unknown = error.data;
		if (
			typeof body === "object" &&
			body !== null &&
			"message" in body &&
			typeof body.message === "string"
		) {
			error.message = `${body.message} (${error.response.status})`;
		}
	}
	return error;
}

/**
 * Client-side API instance.
 *
 * Use this in Svelte components for client-side requests (onclick handlers, effects, etc.).
 * For server-side requests (load functions, form actions), use `getApi()` from `$lib/server/api`.
 */
export const api = ky.create({
	baseUrl: API_PREFIX,
	timeout: 10_000,
	retry: {
		limit: 2,
		methods: ["get", "head", "options"],
		retryOnTimeout: true,
		backoffLimit: 3000,
		jitter: true,
	},
	hooks: {
		beforeError: [extractErrorMessage],
	},
});
