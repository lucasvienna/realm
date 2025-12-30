<script lang="ts">
	import type { BuildingState } from "$lib/domain/building";
	import { Progress } from "$lib/components/ui/progress";
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

	const upgradeProgress = $derived.by(() => {
		if (!building.upgrade_finishes_at) return 0;

		const finishTime = DateTime.fromISO(building.upgrade_finishes_at);
		if (!finishTime.isValid) return 0;

		const totalSeconds = parseInt(building.upgrade_seconds, 10);
		if (totalSeconds <= 0) return 100;

		const startTime = finishTime.minus({ seconds: totalSeconds });
		const elapsed = now.diff(startTime, "seconds").seconds;
		const progress = Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));

		return progress;
	});

	// Building type to color and shape mapping
	type BuildingStyle = {
		fill: string;
		stroke: string;
		accent: string;
		type: "keep" | "farm" | "lumber" | "quarry" | "mine" | "barracks" | "storage" | "default";
	};

	const buildingStyles: Record<string, BuildingStyle> = {
		// Main buildings
		keep: { fill: "#6366f1", stroke: "#4338ca", accent: "#a5b4fc", type: "keep" },
		castle: { fill: "#6366f1", stroke: "#4338ca", accent: "#a5b4fc", type: "keep" },
		"town hall": { fill: "#6366f1", stroke: "#4338ca", accent: "#a5b4fc", type: "keep" },
		// Resource buildings
		farm: { fill: "#f59e0b", stroke: "#d97706", accent: "#fcd34d", type: "farm" },
		lumberyard: { fill: "#22c55e", stroke: "#16a34a", accent: "#86efac", type: "lumber" },
		lumbermill: { fill: "#22c55e", stroke: "#16a34a", accent: "#86efac", type: "lumber" },
		quarry: { fill: "#64748b", stroke: "#475569", accent: "#cbd5e1", type: "quarry" },
		mine: { fill: "#eab308", stroke: "#ca8a04", accent: "#fef08a", type: "mine" },
		"gold mine": { fill: "#eab308", stroke: "#ca8a04", accent: "#fef08a", type: "mine" },
		// Military
		barracks: { fill: "#ef4444", stroke: "#dc2626", accent: "#fca5a5", type: "barracks" },
		// Storage
		warehouse: { fill: "#8b5cf6", stroke: "#7c3aed", accent: "#c4b5fd", type: "storage" },
		storehouse: { fill: "#8b5cf6", stroke: "#7c3aed", accent: "#c4b5fd", type: "storage" },
		granary: { fill: "#f97316", stroke: "#ea580c", accent: "#fdba74", type: "storage" },
	};

	const defaultStyle: BuildingStyle = {
		fill: "#71717a",
		stroke: "#52525b",
		accent: "#a1a1aa",
		type: "default",
	};

	const style = $derived(buildingStyles[building.name.toLowerCase()] ?? defaultStyle);

	const isUpgrading = $derived(building.upgrade_finishes_at != null);
	const isMaxLevel = $derived(building.level >= building.max_level);
	const isReadyToConfirm = $derived.by(() => {
		if (!building.upgrade_finishes_at) return false;
		const finishTime = DateTime.fromISO(building.upgrade_finishes_at);
		if (!finishTime.isValid) return false;
		return now >= finishTime;
	});
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
			<ellipse cx="12" cy="78" rx="8" ry="6" fill="#fcd34d" stroke="#d97706" stroke-width="1" />
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
			<circle cx="50" cy="60" r="12" fill="#d1d5db" stroke={style.stroke} stroke-width="2" />
			<circle cx="50" cy="60" r="3" fill={style.stroke} />
			<!-- Log pile -->
			<ellipse cx="18" cy="80" rx="6" ry="4" fill="#92400e" stroke="#78350f" stroke-width="1" />
			<ellipse cx="18" cy="74" rx="6" ry="4" fill="#a16207" stroke="#78350f" stroke-width="1" />
			<ellipse cx="18" cy="68" rx="6" ry="4" fill="#92400e" stroke="#78350f" stroke-width="1" />
			<!-- Tree stump -->
			<ellipse cx="85" cy="82" rx="8" ry="5" fill="#92400e" stroke="#78350f" stroke-width="1" />
			<ellipse cx="85" cy="80" rx="6" ry="3" fill="#a16207" />
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
				fill="#94a3b8"
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
			<line x1="70" y1="85" x2="70" y2="25" stroke="#78716c" stroke-width="3" />
			<line x1="70" y1="25" x2="45" y2="25" stroke="#78716c" stroke-width="3" />
			<line x1="45" y1="25" x2="45" y2="40" stroke="#a8a29e" stroke-width="1" />
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
			<polygon points="10,85 50,30 90,85" fill="#78716c" stroke={style.stroke} stroke-width="2" />
			<!-- Mine entrance -->
			<path
				d="M35,85 L35,55 Q50,45 65,55 L65,85"
				fill="#1c1917"
				stroke={style.stroke}
				stroke-width="2"
			/>
			<!-- Wooden supports -->
			<rect x="33" y="50" width="4" height="35" fill="#92400e" />
			<rect x="63" y="50" width="4" height="35" fill="#92400e" />
			<rect x="33" y="50" width="34" height="5" fill="#a16207" />
			<!-- Cart tracks -->
			<line x1="40" y1="85" x2="25" y2="95" stroke="#78716c" stroke-width="2" />
			<line x1="60" y1="85" x2="75" y2="95" stroke="#78716c" stroke-width="2" />
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
			<rect x="8" y="72" width="10" height="10" fill="#a16207" stroke="#78350f" stroke-width="1" />
			<rect x="10" y="64" width="8" height="8" fill="#ca8a04" stroke="#78350f" stroke-width="1" />
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
					<circle cx="15" cy="18" r="10" fill="#22c55e" stroke="#16a34a" stroke-width="1.5" />
					<text x="15" y="23" text-anchor="middle" font-size="12" fill="white">✓</text>
				{:else}
					<circle cx="15" cy="18" r="10" fill="#f59e0b" stroke="#d97706" stroke-width="1.5" />
					<text x="15" y="23" text-anchor="middle" font-size="12" fill="white">⚡</text>
				{/if}
			</g>
		{/if}

		<!-- Max level star -->
		{#if isMaxLevel}
			<g>
				<circle cx="15" cy="18" r="10" fill="#eab308" stroke="#ca8a04" stroke-width="1.5" />
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
