import { getRequestEvent } from "$app/server";
import { API_PREFIX } from "$lib/constants";
import ky, { type HTTPError, type KyInstance, type Options } from "ky";

const defaultRetry = {
	limit: 2,
	methods: ["get", "head", "options"],
	retryOnTimeout: true,
	backoffLimit: 3000,
	jitter: true,
} satisfies Options["retry"];

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
 * Creates a server-side API instance using SvelteKit's `event.fetch`.
 *
 * Requests are made to `/api/*` and routed via `handleFetch` hook:
 * - Auth endpoints (`/api/auth/*`): Pass through proxy (cookies auto-forwarded)
 * - Other endpoints: Rewritten to internal backend URL (bypasses load balancer)
 *
 * Use this in server load functions, form actions, and API routes.
 * For client-side requests, use `api` from `$lib/api`.
 *
 * @example
 * ```ts
 * // +page.server.ts
 * import { getApi } from "$lib/server/api";
 *
 * export const load: PageServerLoad = async () => {
 *   const api = getApi();
 *   const data = await api.get("endpoint").json<MyType>();
 *   return { data };
 * };
 * ```
 */
export function getApi(options?: Options): KyInstance {
	const { fetch, url } = getRequestEvent();

	return ky.create({
		fetch,
		prefixUrl: `${url.origin}${API_PREFIX}`,
		timeout: 10_000,
		...options,
		retry:
			typeof options?.retry === "object"
				? { ...defaultRetry, ...options.retry }
				: (options?.retry ?? defaultRetry),
		hooks: {
			...options?.hooks,
			beforeError: [extractErrorMessage, ...(options?.hooks?.beforeError ?? [])],
		},
	});
}
