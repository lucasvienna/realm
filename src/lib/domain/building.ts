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
	upgrade_seconds: number;
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
	construction: ConstructionInfo;
}

/// Contains resource costs and time required for building construction
export interface ConstructionInfo {
	/// Food required for construction
	food: number;
	/// Wood required for construction
	wood: number;
	/// Stone required for construction
	stone: number;
	/// Gold required for construction
	gold: number;
	/// Time in seconds to complete construction
	time_seconds: number;
}

export type BuildingLock =
	| { kind: "MaxCountReached" }
	| { kind: "BuildingLevelRequired"; building: number; current: number; required: number }
	| { kind: "TechNodeRequired"; node_id: string };

/** Full building definition with all levels, used by `/game/buildings/all` */
export interface BuildingDefinition {
	id: number;
	name: string;
	max_level: number;
	max_count: number;
	faction: Faction;
	starter: boolean;
	unit_types: string[];
	levels: BuildingLevelInfo[];
}

/** Level-specific information including costs, production, capacity, and requirements */
export interface BuildingLevelInfo {
	level: number;
	upgrade_seconds: number;
	training_capacity: number | null;
	costs: ResourceCosts;
	production: ResourceProduction;
	capacity: ResourceCapacity;
	requirements: LevelRequirement[];
}

export interface ResourceCosts {
	food: number;
	wood: number;
	stone: number;
	gold: number;
}

export interface ResourceProduction {
	population: number;
	food: number;
	wood: number;
	stone: number;
	gold: number;
}

export interface ResourceCapacity {
	food: number;
	wood: number;
	stone: number;
	gold: number;
	food_acc: number;
	wood_acc: number;
	stone_acc: number;
	gold_acc: number;
}

export interface LevelRequirement {
	required_building_id?: number;
	required_building_level?: number;
	required_tech_id?: string;
	required_tech_level?: number;
}
