<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import * as Popover from "$lib/components/ui/popover";
	import { Separator } from "$lib/components/ui/separator";
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

	const COLLECT_COOLDOWN_SECONDS = 30;
	let now = $state(Date.now());

	$effect(() => {
		const interval = setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => clearInterval(interval);
	});

	const collectCooldownRemaining = $derived(() => {
		const collectedAt = new Date(resources.collected_at).getTime();
		const elapsedSeconds = (now - collectedAt) / 1000;
		return Math.max(0, Math.ceil(COLLECT_COOLDOWN_SECONDS - elapsedSeconds));
	});

	const canCollect = $derived(collectCooldownRemaining() === 0);

	function formatNumber(n: number): string {
		if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
		return n.toLocaleString();
	}

	function formatRelativeTime(ts: string): string {
		const now2 = Date.now();
		const date = new Date(ts).getTime();
		const diffMs = now2 - date;

		const seconds = Math.floor(diffMs / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `${days}d ago`;
		if (hours > 0) return `${hours}h ago`;
		if (minutes > 0) return `${minutes}m ago`;
		return "just now";
	}

	function calculateOptimisticAcc(acc: number, accCap: number, rate: number): number {
		const now2 = Date.now();
		const producedAt = new Date(resources.produced_at).getTime();
		const hoursSinceProduced = (now2 - producedAt) / (1000 * 60 * 60);
		const optimistic = acc + rate * hoursSinceProduced;
		return Math.max(0, Math.floor(Math.min(optimistic, accCap)));
	}

	const resourceItems = $derived([
		{
			name: "Food",
			icon: Wheat,
			current: resources.food,
			cap: resources.food_cap,
			rate: resources.food_rate,
			acc: resources.food_acc,
			accCap: resources.food_acc_cap,
			color: "text-amber-500",
		},
		{
			name: "Wood",
			icon: TreePine,
			current: resources.wood,
			cap: resources.wood_cap,
			rate: resources.wood_rate,
			acc: resources.wood_acc,
			accCap: resources.wood_acc_cap,
			color: "text-emerald-600",
		},
		{
			name: "Stone",
			icon: Mountain,
			current: resources.stone,
			cap: resources.stone_cap,
			rate: resources.stone_rate,
			acc: resources.stone_acc,
			accCap: resources.stone_acc_cap,
			color: "text-slate-400",
		},
		{
			name: "Gold",
			icon: Coins,
			current: resources.gold,
			cap: resources.gold_cap,
			rate: resources.gold_rate,
			acc: resources.gold_acc,
			accCap: resources.gold_acc_cap,
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
				<Popover.Root>
					<Popover.Trigger
						class="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors hover:bg-muted/50"
					>
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
					</Popover.Trigger>
					<Popover.Content class="w-64" align="start">
						<div class="space-y-3">
							<div class="flex items-center gap-2">
								<res.icon class="size-5 {res.color}" />
								<span class="font-semibold">{res.name}</span>
							</div>

							<div class="grid grid-cols-2 gap-2 text-sm">
								<div class="text-muted-foreground">Current</div>
								<div class="text-right font-medium">{res.current} / {res.cap}</div>

								<div class="text-muted-foreground">Rate</div>
								<div class="text-right font-medium">+{res.rate}/h</div>

								<div class="text-muted-foreground">Accumulator</div>
								<div class="text-right font-medium">
									{calculateOptimisticAcc(res.acc, res.accCap, res.rate)} / {res.accCap}
								</div>
							</div>

							<Separator />

							<div class="space-y-1 text-xs text-muted-foreground">
								<div>Last produced: {formatRelativeTime(resources.produced_at)}</div>
								<div>Last collected: {formatRelativeTime(resources.collected_at)}</div>
							</div>
						</div>
					</Popover.Content>
				</Popover.Root>
			{/each}
		</div>

		<!-- Actions -->
		<div class="flex shrink-0 items-center gap-1">
			<form method="POST" action="/game?/collect" use:enhance>
				<Button
					type="submit"
					size="sm"
					variant="outline"
					class="hidden sm:inline-flex"
					disabled={!canCollect}
				>
					{#if canCollect}
						Collect
					{:else}
						{collectCooldownRemaining()}s
					{/if}
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
