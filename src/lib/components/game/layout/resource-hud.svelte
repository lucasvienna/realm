<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import type { ResourcesState } from "$lib/domain/resource";
	import Wheat from "@lucide/svelte/icons/wheat";
	import TreePine from "@lucide/svelte/icons/tree-pine";
	import Mountain from "@lucide/svelte/icons/mountain";
	import Coins from "@lucide/svelte/icons/coins";
	import Bell from "@lucide/svelte/icons/bell";
	import Settings from "@lucide/svelte/icons/settings";
	import User from "@lucide/svelte/icons/user";

	interface Props {
		resources: ResourcesState;
		playerName: string;
		notificationCount?: number;
	}

	let { resources, playerName, notificationCount = 0 }: Props = $props();

	function formatNumber(n: number): string {
		if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
		return n.toLocaleString();
	}

	const resourceItems = $derived([
		{
			name: "Food",
			icon: Wheat,
			current: resources.food,
			cap: resources.food_cap,
			rate: resources.food_rate,
			color: "text-amber-500",
		},
		{
			name: "Wood",
			icon: TreePine,
			current: resources.wood,
			cap: resources.wood_cap,
			rate: resources.wood_rate,
			color: "text-emerald-600",
		},
		{
			name: "Stone",
			icon: Mountain,
			current: resources.stone,
			cap: resources.stone_cap,
			rate: resources.stone_rate,
			color: "text-slate-400",
		},
		{
			name: "Gold",
			icon: Coins,
			current: resources.gold,
			cap: resources.gold_cap,
			rate: resources.gold_rate,
			color: "text-yellow-500",
		},
	]);
</script>

<header
	class="fixed inset-x-0 top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="flex h-14 items-center justify-between px-4">
		<!-- Resources (scrollable on mobile) -->
		<div class="flex items-center gap-3 overflow-x-auto md:gap-5">
			{#each resourceItems as res (res.name)}
				<div class="flex shrink-0 items-center gap-1.5" title="{res.name}: {res.current}/{res.cap}">
					<res.icon class="size-4 {res.color}" />
					<div class="flex flex-col leading-none">
						<span class="text-sm font-semibold">
							{formatNumber(res.current)}
							<span class="text-xs font-normal text-muted-foreground">
								/{formatNumber(res.cap)}
							</span>
						</span>
						<span class="text-[10px] text-muted-foreground">+{res.rate}/h</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Actions -->
		<div class="flex shrink-0 items-center gap-1">
			<form method="POST" action="/game?/collect" use:enhance>
				<Button type="submit" size="sm" variant="outline" class="hidden sm:inline-flex">
					Collect
				</Button>
			</form>

			<Button variant="ghost" size="icon" class="relative" aria-label="Notifications">
				<Bell class="size-4" />
				{#if notificationCount > 0}
					<Badge
						variant="destructive"
						class="absolute -top-1 -right-1 size-4 justify-center p-0 text-[10px]"
					>
						{notificationCount > 9 ? "9+" : notificationCount}
					</Badge>
				{/if}
			</Button>

			<Button variant="ghost" size="icon">
				<Settings class="size-4" />
			</Button>

			<Button variant="ghost" size="icon" href={resolve("/account")}>
				<User class="size-4" />
				<span class="sr-only">{playerName}</span>
			</Button>
		</div>
	</div>
</header>
