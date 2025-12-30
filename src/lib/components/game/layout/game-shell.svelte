<script lang="ts">
	import type { Snippet } from "svelte";
	import type { ResourcesState } from "$lib/domain/resource";
	import ResourceHud from "./resource-hud.svelte";
	import TabBar from "./tab-bar.svelte";

	interface Props {
		resources: ResourcesState;
		playerName: string;
		questCount?: number;
		hasNotification?: boolean;
		children: Snippet;
	}

	let {
		resources,
		playerName,
		questCount = 0,
		hasNotification = false,
		children,
	}: Props = $props();
</script>

<div class="flex min-h-svh flex-col bg-muted/40">
	<!-- Top HUD -->
	<ResourceHud {resources} {playerName} />

	<!-- Main Content Area (with padding for fixed HUD and tab bar) -->
	<main class="flex-1 pt-14 pb-16">
		{@render children()}
	</main>

	<!-- Bottom Tab Bar -->
	<TabBar {questCount} {hasNotification} />
</div>
