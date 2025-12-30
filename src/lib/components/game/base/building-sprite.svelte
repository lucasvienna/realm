<script lang="ts">
	import type { BuildingState } from "$lib/domain/building";
	import { Progress } from "$lib/components/ui/progress";

	interface Props {
		building: BuildingState;
		onclick?: () => void;
	}

	let { building, onclick }: Props = $props();

	// Building type to color mapping based on name
	const buildingColors: Record<string, { fill: string; stroke: string; accent: string }> = {
		// Main buildings
		keep: { fill: "#6366f1", stroke: "#4338ca", accent: "#a5b4fc" }, // Indigo
		castle: { fill: "#6366f1", stroke: "#4338ca", accent: "#a5b4fc" }, // Indigo
		"town hall": { fill: "#6366f1", stroke: "#4338ca", accent: "#a5b4fc" }, // Indigo
		// Resource buildings
		farm: { fill: "#f59e0b", stroke: "#d97706", accent: "#fcd34d" }, // Amber
		lumberyard: { fill: "#22c55e", stroke: "#16a34a", accent: "#86efac" }, // Green
		lumbermill: { fill: "#22c55e", stroke: "#16a34a", accent: "#86efac" }, // Green
		quarry: { fill: "#64748b", stroke: "#475569", accent: "#cbd5e1" }, // Slate
		mine: { fill: "#eab308", stroke: "#ca8a04", accent: "#fef08a" }, // Yellow
		"gold mine": { fill: "#eab308", stroke: "#ca8a04", accent: "#fef08a" }, // Yellow
		// Military
		barracks: { fill: "#ef4444", stroke: "#dc2626", accent: "#fca5a5" }, // Red
		// Storage
		warehouse: { fill: "#8b5cf6", stroke: "#7c3aed", accent: "#c4b5fd" }, // Violet
		storehouse: { fill: "#8b5cf6", stroke: "#7c3aed", accent: "#c4b5fd" }, // Violet
		granary: { fill: "#f97316", stroke: "#ea580c", accent: "#fdba74" }, // Orange
		// Default
		default: { fill: "#71717a", stroke: "#52525b", accent: "#a1a1aa" }, // Zinc
	};

	const colors = $derived(buildingColors[building.name.toLowerCase()] ?? buildingColors.default);

	const isUpgrading = $derived(building.upgrade_finishes_at != null);
	const isMaxLevel = $derived(building.level >= building.max_level);
</script>

<button
	type="button"
	class="group relative flex flex-col items-center transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
	{onclick}
>
	<!-- Building SVG -->
	<svg
		viewBox="0 0 100 100"
		class="size-20 drop-shadow-md md:size-24"
		role="img"
		aria-label="{building.name} Level {building.level}"
	>
		<!-- Base/Foundation -->
		<ellipse cx="50" cy="85" rx="40" ry="10" fill={colors.stroke} opacity="0.3" />

		<!-- Main building body -->
		<rect
			x="20"
			y="35"
			width="60"
			height="50"
			rx="4"
			fill={colors.fill}
			stroke={colors.stroke}
			stroke-width="2"
		/>

		<!-- Roof -->
		<polygon
			points="10,35 50,10 90,35"
			fill={colors.accent}
			stroke={colors.stroke}
			stroke-width="2"
		/>

		<!-- Door -->
		<rect x="40" y="55" width="20" height="30" rx="2" fill={colors.stroke} />

		<!-- Windows -->
		<rect x="26" y="45" width="10" height="10" rx="1" fill={colors.accent} opacity="0.8" />
		<rect x="64" y="45" width="10" height="10" rx="1" fill={colors.accent} opacity="0.8" />

		<!-- Level indicator -->
		<circle cx="50" cy="22" r="8" fill="white" stroke={colors.stroke} stroke-width="1.5" />
		<text x="50" y="26" text-anchor="middle" font-size="10" font-weight="bold" fill={colors.stroke}>
			{building.level}
		</text>

		<!-- Upgrade indicator -->
		{#if isUpgrading}
			<g>
				<circle cx="80" cy="20" r="10" fill="#f59e0b" stroke="#d97706" stroke-width="1.5" />
				<text x="80" y="24" text-anchor="middle" font-size="10" fill="white">⚡</text>
			</g>
		{/if}

		<!-- Max level star -->
		{#if isMaxLevel}
			<g>
				<circle cx="80" cy="20" r="10" fill="#eab308" stroke="#ca8a04" stroke-width="1.5" />
				<text x="80" y="24" text-anchor="middle" font-size="10" fill="white">★</text>
			</g>
		{/if}
	</svg>

	<!-- Building name -->
	<span class="mt-1 text-xs font-medium text-foreground">{building.name}</span>

	<!-- Upgrade progress bar -->
	{#if isUpgrading}
		<div class="mt-1 w-full">
			<Progress value={50} class="h-1" />
		</div>
	{/if}

	<!-- Hover highlight -->
	<div
		class="absolute inset-0 rounded-lg bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100"
	></div>
</button>
