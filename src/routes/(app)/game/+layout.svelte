<script lang="ts">
	import GameShell from "$lib/components/game/layout/game-shell.svelte";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();

	const resources = $derived(data.gameData.resources);
	const playerName = $derived(data.gameData.player.name);
</script>

<GameShell {resources} {playerName}>
	{@render children()}
</GameShell>
