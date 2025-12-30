import type { BuildingAvailability } from "$lib/domain/building";

import { query } from "$app/server";
import { getApi } from "$lib/server/api";
import { requireLogin } from "$lib/server/auth";
import { HTTPError } from "ky";
import invariant from "tiny-invariant";

export const getAvailableBuildings = query(async () => {
	requireLogin();
	const api = getApi();

	return api
		.get("game/buildings/available")
		.json<BuildingAvailability[]>()
		.catch(async (e) => {
			invariant(e instanceof HTTPError, "ky didn't return HTTPError");
			const body = await e.response.json().catch(() => ({ error: "Unknown error" }));
			throw new Error(`Failed to load game data: ${body.error}`);
		});
});
