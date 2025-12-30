<script lang="ts">
	import BuildDialog from "$lib/components/build-dialog.svelte";
	import BaseViewport from "$lib/components/game/base/base-viewport.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	const resources = $derived(data.gameData.resources);
	const player = $derived(data.gameData.player);
	const buildings = $derived(data.gameData.buildings);
</script>

<div class="flex h-full flex-col">
	<!-- Header with title and build button -->
	<div class="flex items-center justify-between border-b bg-background/50 px-4 py-3">
		<div>
			<h1 class="text-xl font-bold tracking-tight">{player.name}'s Realm</h1>
			<p class="text-xs text-muted-foreground capitalize">Faction: {player.faction}</p>
		</div>
		<BuildDialog />
	</div>

	<!-- Building Viewport -->
	<div class="flex-1">
		<BaseViewport {buildings} {resources} />
	</div>
</div>
