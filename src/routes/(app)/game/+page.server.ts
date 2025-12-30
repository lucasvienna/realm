import type { GameBuilding } from "$lib/domain/building";
import type { ResourcesState } from "$lib/domain/resource";

import { getApi } from "$lib/server/api";
import invariant from "tiny-invariant";

import type { Actions } from "./$types";

export const actions: Actions = {
	async collect() {
		const api = getApi();
		return api
			.post("game/resources/collect")
			.json<ResourcesState>()
			.then((body) => {
				console.log("Collect resources succeeded");
				return body;
			})
			.catch((e) => {
				console.error("Failed to collect resources:", e.message);
			});
	},

	async upgrade({ request }) {
		const data = await request.formData();
		const bld_id = data.get("bld_id")?.valueOf();
		invariant(bld_id && typeof bld_id === "string", "Building ID should not be null");

		const api = getApi();
		return api
			.post(`game/buildings/${bld_id}/upgrade`)
			.json<GameBuilding>()
			.catch((e) => {
				console.error("Upgrade failed:", e.message);
			});
	},

	async confirm({ request }) {
		const data = await request.formData();
		const bld_id = data.get("bld_id")?.valueOf();
		invariant(bld_id && typeof bld_id === "string", "Building ID should not be null");

		const api = getApi();
		return api
			.post(`game/buildings/${bld_id}/upgrade/confirm`)
			.json<GameBuilding>()
			.catch((e) => {
				console.error("Upgrade confirmation failed:", e.message);
			});
	},
};
