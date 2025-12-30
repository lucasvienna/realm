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

	let selectedBuilding = $state<BuildingState | null>(null);
	let panelOpen = $state(false);

	// Flatten buildings into a single array for display
	const allBuildings = $derived(
		Object.values(buildings)
			.flat()
			.filter((b): b is BuildingState => b != null),
	);

	function selectBuilding(building: BuildingState) {
		selectedBuilding = building;
		panelOpen = true;
	}

	function handlePanelOpenChange(open: boolean) {
		panelOpen = open;
		if (!open) {
			selectedBuilding = null;
		}
	}
</script>

<div class="relative h-full w-full overflow-auto">
	<!-- Grid-based building layout -->
	<div class="min-h-[400px] p-4">
		{#if allBuildings.length === 0}
			<div class="flex h-64 items-center justify-center text-muted-foreground">
				<p>No buildings yet. Use the Build button to construct your first building!</p>
			</div>
		{:else}
			<div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));">
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
