import { requireLogin } from "$lib/server/auth";
import type { PageServerLoad, Actions } from "./$types";
import type { GameBuilding, GameData, ResourcesState } from "./game";
import invariant from "tiny-invariant";

export const load: PageServerLoad = async ({ fetch }) => {
	requireLogin();

	const res = await fetch("/api/game");
	if (res.status !== 200) {
		const body = await res.json();
		throw new Error(`Failed to load game data: ${body.error}`);
	}
	const gameData: GameData = await res.json();
	return { gameData };
};

export const actions: Actions = {
	async collect(event) {
		const res = await event.fetch("/api/game/resources/collect", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("Collect resources response:", res);
		if (res.ok) {
			const body: ResourcesState = await res.json();
			console.log("Collected resources:", body);
			return body;
		} else {
			console.error("Failed to collect resources:", res.statusText);
		}
	},
	async upgrade({ fetch, request }) {
		const data = await request.formData();
		const bld_id = data.get("bld_id");
		invariant(bld_id, "Building ID should not be null");
		const response = await fetch(`/api/game/buildings/${bld_id}/upgrade`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const body: GameBuilding = await response.json();
		if (response.ok) {
			console.log("Upgrade successful:", body);
			return body;
		} else {
			console.error("Upgrade failed:", body);
		}
	},
	async confirm({ fetch, request }) {
		const data = await request.formData();
		const bld_id = data.get("bld_id");
		invariant(bld_id, "Building ID should not be null");
		const response = await fetch(`/api/game/buildings/${bld_id}/upgrade/confirm`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const body: GameBuilding = await response.json();
		if (response.ok) {
			console.log("Upgrade successful:", body);
			return body;
		} else {
			console.error("Upgrade failed:", body);
		}
	},
};
