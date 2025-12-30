<script lang="ts">
	import { page } from "$app/stores";
	import { resolve } from "$app/paths";
	import { Badge } from "$lib/components/ui/badge";
	import Castle from "@lucide/svelte/icons/castle";
	import Swords from "@lucide/svelte/icons/swords";
	import FlaskConical from "@lucide/svelte/icons/flask-conical";
	import Scroll from "@lucide/svelte/icons/scroll";
	import Users from "@lucide/svelte/icons/users";
	import type { Component } from "svelte";

	type GameRoute =
		| "/(app)/game"
		| "/(app)/game/army"
		| "/(app)/game/research"
		| "/(app)/game/quests"
		| "/(app)/game/social";

	interface Tab {
		route: GameRoute;
		path: string;
		label: string;
		icon: Component;
	}

	interface Props {
		questCount?: number;
		hasNotification?: boolean;
	}

	let { questCount = 0, hasNotification = false }: Props = $props();

	const baseTabs: Tab[] = [
		{ route: "/(app)/game", path: "/game", label: "Base", icon: Castle },
		{ route: "/(app)/game/army", path: "/game/army", label: "Army", icon: Swords },
		{
			route: "/(app)/game/research",
			path: "/game/research",
			label: "Research",
			icon: FlaskConical,
		},
		{ route: "/(app)/game/quests", path: "/game/quests", label: "Quests", icon: Scroll },
		{ route: "/(app)/game/social", path: "/game/social", label: "Social", icon: Users },
	];

	function isActive(path: string): boolean {
		const currentPath = $page.url.pathname;
		if (path === "/game") {
			return currentPath === "/game" || currentPath === "/game/";
		}
		return currentPath.startsWith(path);
	}

	function getBadge(path: string): number | undefined {
		if (path === "/game/quests" && questCount > 0) return questCount;
		return undefined;
	}

	function hasDot(path: string): boolean {
		return path === "/game/social" && hasNotification;
	}
</script>

<nav
	class="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
		{#each baseTabs as tab (tab.route)}
			{@const active = isActive(tab.path)}
			{@const badge = getBadge(tab.path)}
			{@const dot = hasDot(tab.path)}
			<a
				href={resolve(tab.route)}
				class="relative flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors {active
					? 'text-primary'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<div class="relative">
					<tab.icon class="size-5" />
					{#if badge}
						<Badge
							variant="destructive"
							class="absolute -top-1 -right-2 size-4 justify-center p-0 text-[10px]"
						>
							{badge > 9 ? "9+" : badge}
						</Badge>
					{/if}
					{#if dot}
						<span class="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-destructive"></span>
					{/if}
				</div>
				<span class="font-medium">{tab.label}</span>
				{#if active}
					<span
						class="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary"
					></span>
				{/if}
			</a>
		{/each}
	</div>
</nav>
