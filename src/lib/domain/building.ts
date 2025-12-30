import type { Faction } from "./faction";

export interface Building {
	id: string;
	name: string;
	max_level: number;
	max_count: number;
	faction: Faction;
	starter: boolean;
	created_at: string;
	updated_at: string;
}

export interface GameBuilding {
	id: string;
	player_id: string;
	building_id: number;
	level: number;
	max_level: number;
	max_count: number;
	upgrade_time: number;
	req_food: number | null;
	req_wood: number | null;
	req_stone: number | null;
	req_gold: number | null;
}

export interface BuildingState {
	id: string;
	building_id: number;
	name: string;
	level: number;
	max_level: number;
	max_count: number;
	upgrade_seconds: string;
	upgrade_finishes_at: string | null;
	req_food: number | null;
	req_wood: number | null;
	req_stone: number | null;
	req_gold: number | null;
	population_per_hour: number;
	food_per_hour: number;
	wood_per_hour: number;
	stone_per_hour: number;
	gold_per_hour: number;
	updated_at: string;
}

export interface BuildingAvailability {
	building: Building;
	buildable: boolean;
	current_count: number;
	max_count: number;
	max_level: number;
	locks: BuildingLock[];
}

export type BuildingLock =
	| { type: "MaxCountReached" }
	| { type: "BuildingLevelRequired"; building: number; current: number; required: number }
	| { type: "TechNodeRequired"; node_id: string };
