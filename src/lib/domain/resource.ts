export enum ResourceType {
	Population = "population",
	Food = "food",
	Wood = "wood",
	Stone = "stone",
	Gold = "gold",
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
	food_rate: number;
	wood_rate: number;
	stone_rate: number;
	gold_rate: number;
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
