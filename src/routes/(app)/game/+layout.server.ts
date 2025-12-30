import type { GameData } from "$lib/domain/game";

import { getApi } from "$lib/server/api";
import { requireLogin } from "$lib/server/auth";
import { HTTPError } from "ky";
import invariant from "tiny-invariant";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
	requireLogin();
	const api = getApi();
	return api
		.get("game")
		.json<GameData>()
		.then((gameData) => ({ gameData }))
		.catch(async (e) => {
			invariant(e instanceof HTTPError, "ky didn't return HTTPError");
			const body = await e.response.json().catch(() => ({ error: "Unknown error" }));
			throw new Error(`Failed to load game data: ${body.error}`);
		});
};
