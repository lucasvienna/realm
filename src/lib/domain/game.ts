import type { BuildingState } from "./building";
import type { Faction } from "./faction";
import type { ResourcesState } from "./resource";

export interface GameData {
	player: {
		id: string;
		name: string;
		faction: Faction;
	};
	resources: ResourcesState;
	buildings: Record<string, BuildingState[]>;
}
