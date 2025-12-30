<script lang="ts">
	import type { BuildingState } from "$lib/domain/building";
	import type { ResourcesState } from "$lib/domain/resource";
	import BuildingSprite from "./building-sprite.svelte";
	import BuildingPanel from "./building-panel.svelte";

	interface Props {
		buildings: Record<string, BuildingState[]>;
		resources: ResourcesState;
	}

	let { buildings, resources }: Props = $props();

	let selectedBuildingId = $state<string | null>(null);
	let panelOpen = $state(false);

	// Flatten buildings into a single array for display
	const allBuildings = $derived(
		Object.values(buildings)
			.flat()
			.filter((b): b is BuildingState => b != null),
	);

	// Derive selected building from fresh data
	const selectedBuilding = $derived(
		selectedBuildingId ? (allBuildings.find((b) => b.id === selectedBuildingId) ?? null) : null,
	);

	function selectBuilding(building: BuildingState) {
		selectedBuildingId = building.id;
		panelOpen = true;
	}

	function handlePanelOpenChange(open: boolean) {
		panelOpen = open;
		if (!open) {
			selectedBuildingId = null;
		}
	}
</script>

<div class="relative h-full w-full overflow-auto">
	<!-- Terrain Background -->
	<div class="absolute inset-0 overflow-hidden">
		<!-- Sky gradient -->
		<div
			class="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-transparent dark:from-sky-900 dark:via-sky-950 dark:to-transparent"
			style="height: 40%;"
		></div>

		<!-- Main grass area -->
		<div
			class="absolute inset-0 bg-gradient-to-b from-emerald-400 to-emerald-500 dark:from-emerald-700 dark:to-emerald-800"
			style="top: 30%;"
		></div>

		<!-- Grass texture pattern -->
		<svg class="absolute inset-0 h-full w-full opacity-30" style="top: 30%;">
			<defs>
				<pattern id="grass" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
					<!-- Grass blades -->
					<path d="M5,40 Q6,30 4,25" stroke="#166534" fill="none" stroke-width="1" />
					<path d="M8,40 Q10,32 7,28" stroke="#15803d" fill="none" stroke-width="1" />
					<path d="M20,40 Q22,35 19,30" stroke="#166534" fill="none" stroke-width="1" />
					<path d="M25,40 Q24,33 26,27" stroke="#15803d" fill="none" stroke-width="1" />
					<path d="M35,40 Q37,34 34,29" stroke="#166534" fill="none" stroke-width="1" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grass)" />
		</svg>

		<!-- Decorative elements -->
		<svg class="absolute bottom-0 left-0 h-full w-full" preserveAspectRatio="none">
			<!-- Distant hills -->
			<ellipse
				cx="15%"
				cy="32%"
				rx="20%"
				ry="8%"
				fill="#86efac"
				class="dark:fill-emerald-600"
				opacity="0.5"
			/>
			<ellipse
				cx="85%"
				cy="35%"
				rx="25%"
				ry="10%"
				fill="#86efac"
				class="dark:fill-emerald-600"
				opacity="0.4"
			/>

			<!-- Path/road -->
			<path
				d="M0,85% Q25%,80% 50%,85% T100%,80%"
				fill="none"
				stroke="#a8a29e"
				stroke-width="20"
				opacity="0.3"
				class="dark:stroke-stone-600"
			/>

			<!-- Scattered rocks -->
			<ellipse cx="8%" cy="75%" rx="1%" ry="0.5%" fill="#78716c" opacity="0.4" />
			<ellipse cx="92%" cy="82%" rx="1.5%" ry="0.7%" fill="#78716c" opacity="0.4" />
			<ellipse cx="45%" cy="90%" rx="0.8%" ry="0.4%" fill="#78716c" opacity="0.3" />

			<!-- Small flowers/details -->
			<circle cx="12%" cy="70%" r="3" fill="#fbbf24" opacity="0.6" />
			<circle cx="88%" cy="65%" r="2" fill="#fb923c" opacity="0.5" />
			<circle cx="25%" cy="88%" r="2" fill="#fbbf24" opacity="0.5" />
			<circle cx="75%" cy="78%" r="3" fill="#f472b6" opacity="0.4" />

			<!-- Trees in distance -->
			<g opacity="0.3" transform="translate(50, 120)">
				<polygon points="0,30 15,0 30,30" fill="#166534" />
				<rect x="12" y="30" width="6" height="10" fill="#78350f" />
			</g>
			<g opacity="0.25" transform="translate(720, 100)">
				<polygon points="0,40 20,0 40,40" fill="#166534" />
				<rect x="16" y="40" width="8" height="12" fill="#78350f" />
			</g>
			<g opacity="0.2" transform="translate(900, 130)">
				<polygon points="0,35 18,0 36,35" fill="#166534" />
				<rect x="14" y="35" width="7" height="10" fill="#78350f" />
			</g>
		</svg>

		<!-- Subtle vignette -->
		<div
			class="pointer-events-none absolute inset-0"
			style="background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.1) 100%);"
		></div>
	</div>

	<!-- Grid-based building layout -->
	<div class="relative z-10 min-h-[400px] p-4 pt-8">
		{#if allBuildings.length === 0}
			<div class="flex h-64 items-center justify-center">
				<div class="rounded-lg bg-background/80 px-6 py-4 text-center backdrop-blur-sm">
					<p class="text-muted-foreground">No buildings yet.</p>
					<p class="text-sm text-muted-foreground">
						Use the Build button to construct your first building!
					</p>
				</div>
			</div>
		{:else}
			<div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));">
				{#each allBuildings as building (building.id)}
					<div class="flex justify-center">
						<BuildingSprite {building} onclick={() => selectBuilding(building)} />
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Building Detail Panel -->
	<BuildingPanel
		building={selectedBuilding}
		{resources}
		open={panelOpen}
		onOpenChange={handlePanelOpenChange}
	/>
</div>
