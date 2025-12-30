import type { MagnitudeKind, ModifierTarget } from "./modifier";
import type { ResourceType } from "./resource";

export enum Faction {
	Neutral = "neutral",
	Human = "human",
	Ord = "orc",
	Elf = "elf",
	Dwarf = "dwarf",
	Gobling = "goblin",
}

export interface FactionBonus {
	/// The target of the bonus (e.g., "resource", "combat", "research")
	target: ModifierTarget;
	/// Specific resource type this bonus affects, if applicable
	target_resource?: ResourceType;
	/// The numerical value of the bonus (percentage, flat amount, etc.)
	value: number;
	/// The type of bonus application (e.g., multiplicative, flat, or percentual)
	scaling: MagnitudeKind;
	/// Human-readable description of what this bonus does
	description: string;
}

export interface FactionResponse {
	/// Unique identifier for the faction
	id: Faction;
	/// Display name of the faction
	name: string;
	/// List of bonuses this faction provides
	bonuses: Array<FactionBonus>;
}
