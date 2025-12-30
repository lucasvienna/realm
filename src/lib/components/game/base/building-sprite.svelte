<script lang="ts">
	import type { BuildingState } from "$lib/domain/building";
	import { Progress } from "$lib/components/ui/progress";
	import { calculateUpgradeProgress, isUpgradeComplete } from "$lib/utils/upgrade-progress";
	import { DateTime } from "luxon";
	import { onDestroy } from "svelte";

	interface Props {
		building: BuildingState;
		onclick?: () => void;
	}

	let { building, onclick }: Props = $props();

	// Reactive progress calculation for upgrading buildings
	let now = $state(DateTime.now());
	let progressInterval: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		if (building.upgrade_finishes_at) {
			// Update progress every second while upgrading
			progressInterval = setInterval(() => {
				now = DateTime.now();
			}, 1000);
		} else if (progressInterval) {
			clearInterval(progressInterval);
			progressInterval = null;
		}
	});

	onDestroy(() => {
		if (progressInterval) {
			clearInterval(progressInterval);
		}
	});

	const upgradeProgress = $derived(
		calculateUpgradeProgress({
			upgradeFinishesAt: building.upgrade_finishes_at,
			upgradeSeconds: building.upgrade_seconds,
			now,
		}),
	);

	// Building type to color and shape mapping
	type BuildingType =
		| "keep"
		| "farm"
		| "lumber"
		| "quarry"
		| "mine"
		| "barracks"
		| "military"
		| "storage"
		| "research"
		| "workshop"
		| "magic"
		| "walls"
		| "church"
		| "monument"
		| "market"
		| "embassy"
		| "default";

	type BuildingStyle = {
		fill: string;
		stroke: string;
		accent: string;
		type: BuildingType;
	};

	const buildingStyles: Record<string, BuildingStyle> = {
		// Core buildings
		keep: {
			fill: "var(--building-keep-fill)",
			stroke: "var(--building-keep-stroke)",
			accent: "var(--building-keep-accent)",
			type: "keep",
		},
		// Resource buildings
		farm: {
			fill: "var(--building-farm-fill)",
			stroke: "var(--building-farm-stroke)",
			accent: "var(--building-farm-accent)",
			type: "farm",
		},
		lumberyard: {
			fill: "var(--building-lumber-fill)",
			stroke: "var(--building-lumber-stroke)",
			accent: "var(--building-lumber-accent)",
			type: "lumber",
		},
		quarry: {
			fill: "var(--building-quarry-fill)",
			stroke: "var(--building-quarry-stroke)",
			accent: "var(--building-quarry-accent)",
			type: "quarry",
		},
		mine: {
			fill: "var(--building-mine-fill)",
			stroke: "var(--building-mine-stroke)",
			accent: "var(--building-mine-accent)",
			type: "mine",
		},
		// Storage
		warehouse: {
			fill: "var(--building-storage-fill)",
			stroke: "var(--building-storage-stroke)",
			accent: "var(--building-storage-accent)",
			type: "storage",
		},
		// Research buildings
		academy: {
			fill: "var(--building-research-fill)",
			stroke: "var(--building-research-stroke)",
			accent: "var(--building-research-accent)",
			type: "research",
		},
		university: {
			fill: "var(--building-research-fill)",
			stroke: "var(--building-research-stroke)",
			accent: "var(--building-research-accent)",
			type: "research",
		},
		laboratory: {
			fill: "var(--building-research-fill)",
			stroke: "var(--building-research-stroke)",
			accent: "var(--building-research-accent)",
			type: "research",
		},
		// Military buildings
		barracks: {
			fill: "var(--building-barracks-fill)",
			stroke: "var(--building-barracks-stroke)",
			accent: "var(--building-barracks-accent)",
			type: "barracks",
		},
		range: {
			fill: "var(--building-military-fill)",
			stroke: "var(--building-military-stroke)",
			accent: "var(--building-military-accent)",
			type: "military",
		},
		stables: {
			fill: "var(--building-military-fill)",
			stroke: "var(--building-military-stroke)",
			accent: "var(--building-military-accent)",
			type: "military",
		},
		// Production
		workshop: {
			fill: "var(--building-workshop-fill)",
			stroke: "var(--building-workshop-stroke)",
			accent: "var(--building-workshop-accent)",
			type: "workshop",
		},
		// Magic
		"mage tower": {
			fill: "var(--building-magic-fill)",
			stroke: "var(--building-magic-stroke)",
			accent: "var(--building-magic-accent)",
			type: "magic",
		},
		// Defense
		walls: {
			fill: "var(--building-walls-fill)",
			stroke: "var(--building-walls-stroke)",
			accent: "var(--building-walls-accent)",
			type: "walls",
		},
		// Religious/Cultural
		church: {
			fill: "var(--building-church-fill)",
			stroke: "var(--building-church-stroke)",
			accent: "var(--building-church-accent)",
			type: "church",
		},
		monument: {
			fill: "var(--building-monument-fill)",
			stroke: "var(--building-monument-stroke)",
			accent: "var(--building-monument-accent)",
			type: "monument",
		},
		// Economic/Social
		"guild hall": {
			fill: "var(--building-market-fill)",
			stroke: "var(--building-market-stroke)",
			accent: "var(--building-market-accent)",
			type: "market",
		},
		market: {
			fill: "var(--building-market-fill)",
			stroke: "var(--building-market-stroke)",
			accent: "var(--building-market-accent)",
			type: "market",
		},
		// Diplomatic
		embassy: {
			fill: "var(--building-embassy-fill)",
			stroke: "var(--building-embassy-stroke)",
			accent: "var(--building-embassy-accent)",
			type: "embassy",
		},
	};

	const defaultStyle: BuildingStyle = {
		fill: "var(--building-default-fill)",
		stroke: "var(--building-default-stroke)",
		accent: "var(--building-default-accent)",
		type: "default",
	};

	const style = $derived(buildingStyles[building.name.toLowerCase()] ?? defaultStyle);

	const isUpgrading = $derived(building.upgrade_finishes_at != null);
	const isMaxLevel = $derived(building.level >= building.max_level);
	const isReadyToConfirm = $derived(isUpgradeComplete(building.upgrade_finishes_at, now));
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
		<!-- Base/Foundation shadow -->
		<ellipse cx="50" cy="88" rx="38" ry="8" fill={style.stroke} opacity="0.3" />

		{#if style.type === "keep"}
			<!-- Keep/Castle: Tower with battlements -->
			<!-- Main tower -->
			<rect
				x="30"
				y="30"
				width="40"
				height="55"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Battlements -->
			<rect
				x="26"
				y="22"
				width="12"
				height="12"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<rect
				x="44"
				y="22"
				width="12"
				height="12"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<rect
				x="62"
				y="22"
				width="12"
				height="12"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Flag -->
			<line x1="50" y1="8" x2="50" y2="22" stroke={style.stroke} stroke-width="2" />
			<polygon points="50,8 65,14 50,20" fill={style.accent} />
			<!-- Gate -->
			<path d="M40,85 L40,60 Q50,52 60,60 L60,85" fill={style.stroke} />
			<!-- Windows -->
			<rect x="36" y="40" width="8" height="10" rx="4" fill={style.accent} opacity="0.9" />
			<rect x="56" y="40" width="8" height="10" rx="4" fill={style.accent} opacity="0.9" />
		{:else if style.type === "farm"}
			<!-- Farm: Barn with silo -->
			<!-- Main barn -->
			<rect
				x="20"
				y="45"
				width="45"
				height="40"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Barn roof -->
			<polygon
				points="15,45 42,20 70,45"
				fill={style.accent}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Barn door -->
			<rect x="32" y="60" width="20" height="25" fill={style.stroke} />
			<line x1="42" y1="60" x2="42" y2="85" stroke={style.accent} stroke-width="1" />
			<!-- Silo -->
			<rect
				x="68"
				y="40"
				width="16"
				height="45"
				rx="8"
				fill={style.accent}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<ellipse
				cx="76"
				cy="40"
				rx="8"
				ry="4"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Hay bale -->
			<ellipse
				cx="12"
				cy="78"
				rx="8"
				ry="6"
				fill="var(--building-farm-accent)"
				stroke="var(--building-farm-stroke)"
				stroke-width="1"
			/>
		{:else if style.type === "lumber"}
			<!-- Lumberyard: Sawmill with logs -->
			<!-- Main building -->
			<rect
				x="25"
				y="45"
				width="50"
				height="40"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Slanted roof -->
			<polygon
				points="20,45 50,25 80,45"
				fill={style.accent}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Saw blade -->
			<circle
				cx="50"
				cy="60"
				r="12"
				fill="var(--building-metal-light)"
				stroke={style.stroke}
				stroke-width="2"
			/>
			<circle cx="50" cy="60" r="3" fill={style.stroke} />
			<!-- Log pile -->
			<ellipse
				cx="18"
				cy="80"
				rx="6"
				ry="4"
				fill="var(--building-wood-medium)"
				stroke="var(--building-wood-dark)"
				stroke-width="1"
			/>
			<ellipse
				cx="18"
				cy="74"
				rx="6"
				ry="4"
				fill="var(--building-wood-light)"
				stroke="var(--building-wood-dark)"
				stroke-width="1"
			/>
			<ellipse
				cx="18"
				cy="68"
				rx="6"
				ry="4"
				fill="var(--building-wood-medium)"
				stroke="var(--building-wood-dark)"
				stroke-width="1"
			/>
			<!-- Tree stump -->
			<ellipse
				cx="85"
				cy="82"
				rx="8"
				ry="5"
				fill="var(--building-wood-medium)"
				stroke="var(--building-wood-dark)"
				stroke-width="1"
			/>
			<ellipse cx="85" cy="80" rx="6" ry="3" fill="var(--building-wood-light)" />
		{:else if style.type === "quarry"}
			<!-- Quarry: Stone pit with crane -->
			<!-- Stone pile base -->
			<polygon
				points="15,85 50,50 85,85"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Stone blocks -->
			<rect
				x="30"
				y="65"
				width="15"
				height="12"
				fill={style.accent}
				stroke={style.stroke}
				stroke-width="1"
			/>
			<rect
				x="50"
				y="70"
				width="12"
				height="10"
				fill="var(--building-metal-medium)"
				stroke={style.stroke}
				stroke-width="1"
			/>
			<rect
				x="38"
				y="55"
				width="10"
				height="10"
				fill={style.accent}
				stroke={style.stroke}
				stroke-width="1"
			/>
			<!-- Crane -->
			<line
				x1="70"
				y1="85"
				x2="70"
				y2="25"
				stroke="var(--building-stone-medium)"
				stroke-width="3"
			/>
			<line
				x1="70"
				y1="25"
				x2="45"
				y2="25"
				stroke="var(--building-stone-medium)"
				stroke-width="3"
			/>
			<line x1="45" y1="25" x2="45" y2="40" stroke="var(--building-stone-light)" stroke-width="1" />
			<!-- Hanging block -->
			<rect
				x="40"
				y="40"
				width="10"
				height="8"
				fill={style.accent}
				stroke={style.stroke}
				stroke-width="1"
			/>
		{:else if style.type === "mine"}
			<!-- Mine: Entrance with cart track -->
			<!-- Mountain/hill -->
			<polygon
				points="10,85 50,30 90,85"
				fill="var(--building-stone-medium)"
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Mine entrance -->
			<path
				d="M35,85 L35,55 Q50,45 65,55 L65,85"
				fill="var(--building-stone-dark)"
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Wooden supports -->
			<rect x="33" y="50" width="4" height="35" fill="var(--building-wood-medium)" />
			<rect x="63" y="50" width="4" height="35" fill="var(--building-wood-medium)" />
			<rect x="33" y="50" width="34" height="5" fill="var(--building-wood-light)" />
			<!-- Cart tracks -->
			<line
				x1="40"
				y1="85"
				x2="25"
				y2="95"
				stroke="var(--building-stone-medium)"
				stroke-width="2"
			/>
			<line
				x1="60"
				y1="85"
				x2="75"
				y2="95"
				stroke="var(--building-stone-medium)"
				stroke-width="2"
			/>
			<!-- Gold nuggets -->
			<circle cx="75" cy="75" r="4" fill={style.accent} stroke={style.stroke} stroke-width="1" />
			<circle cx="82" cy="80" r="3" fill={style.fill} stroke={style.stroke} stroke-width="1" />
		{:else if style.type === "barracks"}
			<!-- Barracks: Military building with flag -->
			<!-- Main building -->
			<rect
				x="20"
				y="40"
				width="60"
				height="45"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Flat roof with railing -->
			<rect
				x="18"
				y="35"
				width="64"
				height="8"
				fill={style.accent}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Battlements on roof -->
			<rect
				x="22"
				y="28"
				width="8"
				height="10"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="1"
			/>
			<rect
				x="46"
				y="28"
				width="8"
				height="10"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="1"
			/>
			<rect
				x="70"
				y="28"
				width="8"
				height="10"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="1"
			/>
			<!-- Flag -->
			<line x1="50" y1="10" x2="50" y2="28" stroke={style.stroke} stroke-width="2" />
			<polygon points="50,10 38,16 50,22" fill={style.accent} />
			<!-- Double doors -->
			<rect x="35" y="58" width="13" height="27" fill={style.stroke} />
			<rect x="52" y="58" width="13" height="27" fill={style.stroke} />
			<!-- Shield emblem -->
			<path
				d="M50,48 L56,52 L56,58 L50,62 L44,58 L44,52 Z"
				fill={style.accent}
				stroke={style.stroke}
				stroke-width="1"
			/>
		{:else if style.type === "storage"}
			<!-- Storage: Warehouse with crates -->
			<!-- Main building -->
			<rect
				x="18"
				y="40"
				width="64"
				height="45"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Curved roof -->
			<ellipse
				cx="50"
				cy="40"
				rx="34"
				ry="15"
				fill={style.accent}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Large door -->
			<rect x="30" y="55" width="40" height="30" fill={style.stroke} />
			<!-- Door divisions -->
			<line x1="50" y1="55" x2="50" y2="85" stroke={style.accent} stroke-width="1" />
			<line x1="30" y1="70" x2="70" y2="70" stroke={style.accent} stroke-width="1" />
			<!-- Crates outside -->
			<rect
				x="8"
				y="72"
				width="10"
				height="10"
				fill="var(--building-wood-light)"
				stroke="var(--building-wood-dark)"
				stroke-width="1"
			/>
			<rect
				x="10"
				y="64"
				width="8"
				height="8"
				fill="var(--building-mine-stroke)"
				stroke="var(--building-wood-dark)"
				stroke-width="1"
			/>
		{:else}
			<!-- Default: Simple house -->
			<rect
				x="25"
				y="40"
				width="50"
				height="45"
				fill={style.fill}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<polygon
				points="20,40 50,18 80,40"
				fill={style.accent}
				stroke={style.stroke}
				stroke-width="2"
			/>
			<rect x="42" y="58" width="16" height="27" rx="2" fill={style.stroke} />
			<rect x="30" y="50" width="10" height="10" rx="1" fill={style.accent} opacity="0.8" />
			<rect x="60" y="50" width="10" height="10" rx="1" fill={style.accent} opacity="0.8" />
		{/if}

		<!-- Level indicator badge -->
		<circle cx="85" cy="18" r="10" fill="white" stroke={style.stroke} stroke-width="2" />
		<text x="85" y="22" text-anchor="middle" font-size="11" font-weight="bold" fill={style.stroke}>
			{building.level}
		</text>

		<!-- Upgrade indicator -->
		{#if isUpgrading}
			<g>
				{#if isReadyToConfirm}
					<circle
						cx="15"
						cy="18"
						r="10"
						fill="var(--building-status-ready-fill)"
						stroke="var(--building-status-ready-stroke)"
						stroke-width="1.5"
					/>
					<text x="15" y="23" text-anchor="middle" font-size="12" fill="white">✓</text>
				{:else}
					<circle
						cx="15"
						cy="18"
						r="10"
						fill="var(--building-status-progress-fill)"
						stroke="var(--building-status-progress-stroke)"
						stroke-width="1.5"
					/>
					<text x="15" y="23" text-anchor="middle" font-size="12" fill="white">⚡</text>
				{/if}
			</g>
		{/if}

		<!-- Max level star -->
		{#if isMaxLevel}
			<g>
				<circle
					cx="15"
					cy="18"
					r="10"
					fill="var(--building-status-max-fill)"
					stroke="var(--building-status-max-stroke)"
					stroke-width="1.5"
				/>
				<text x="15" y="23" text-anchor="middle" font-size="12" fill="white">★</text>
			</g>
		{/if}
	</svg>

	<!-- Building name -->
	<span class="mt-1 text-xs font-medium text-foreground">{building.name}</span>

	<!-- Upgrade progress bar -->
	{#if isUpgrading}
		<div class="mt-1 w-full">
			<Progress
				value={upgradeProgress}
				class="h-1 {isReadyToConfirm ? '[&>div]:bg-green-500' : ''}"
			/>
		</div>
	{/if}

	<!-- Hover highlight -->
	<div
		class="absolute inset-0 rounded-lg bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100"
	></div>
</button>
