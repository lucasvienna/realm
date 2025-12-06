import ky, { type HTTPError } from "ky";

import { API_PREFIX } from "./constants";

/**
 * Extracts error message from the response body and enhances the error.
 * Uses `response.clone()` to preserve the body for downstream consumers.
 */
async function extractErrorMessage(error: HTTPError): Promise<HTTPError> {
	const { response } = error;
	if (response) {
		try {
			const body: unknown = await response.clone().json();
			if (
				typeof body === "object" &&
				body !== null &&
				"message" in body &&
				typeof body.message === "string"
			) {
				error.message = `${body.message} (${response.status})`;
			}
		} catch {
			// Response wasn't JSON, keep original message
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
	prefixUrl: API_PREFIX,
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
