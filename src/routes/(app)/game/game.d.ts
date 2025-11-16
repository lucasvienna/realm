export interface GameData {
	player: {
		id: string;
		name: string;
		faction: string;
	};
	resources: ResourcesState;
	buildings: Record<string, BuildingState[]>;
}

export interface ResourcesState {
	food: number;
	wood: number;
	stone: number;
	gold: number;
	food_cap: number;
	wood_cap: number;
	stone_cap: number;
	gold_cap: number;
	food_acc: number;
	wood_acc: number;
	stone_acc: number;
	gold_acc: number;
	food_acc_cap: number;
	wood_acc_cap: number;
	stone_acc_cap: number;
	gold_acc_cap: number;
	produced_at: string; // timestamptz
	collected_at: string; // timestamptz
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

export interface GameBuilding {
	id: string; // PlayerBuildingKey -> string
	player_id: string; // PlayerKey -> string
	building_id: number;
	level: number;
	max_level: number;
	max_count: number;
	upgrade_time: number; // i64 -> number
	req_food: number | null;
	req_wood: number | null;
	req_stone: number | null;
	req_gold: number | null;
}
