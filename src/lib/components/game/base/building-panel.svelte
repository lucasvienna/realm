<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { BuildingState } from "$lib/domain/building";
	import type { ResourcesState } from "$lib/domain/resource";
	import { Button } from "$lib/components/ui/button";
	import { Progress } from "$lib/components/ui/progress";
	import * as Dialog from "$lib/components/ui/dialog";
	import Wheat from "@lucide/svelte/icons/wheat";
	import TreePine from "@lucide/svelte/icons/tree-pine";
	import Mountain from "@lucide/svelte/icons/mountain";
	import Coins from "@lucide/svelte/icons/coins";
	import Clock from "@lucide/svelte/icons/clock";
	import { DateTime } from "luxon";
	import { onDestroy } from "svelte";

	interface Props {
		building: BuildingState | null;
		resources: ResourcesState;
		open: boolean;
		onOpenChange: (open: boolean) => void;
	}

	let { building, resources, open, onOpenChange }: Props = $props();

	// Reactive progress calculation
	let now = $state(DateTime.now());
	let progressInterval: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		if (building?.upgrade_finishes_at) {
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
		if (!building?.upgrade_finishes_at) return 0;

		const finishTime = DateTime.fromISO(building.upgrade_finishes_at);
		if (!finishTime.isValid) return 0;

		const totalSeconds = parseInt(building.upgrade_seconds, 10);
		if (totalSeconds <= 0) return 100;

		const startTime = finishTime.minus({ seconds: totalSeconds });
		const elapsed = now.diff(startTime, "seconds").seconds;
		return Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));
	});

	const remainingTime = $derived.by(() => {
		if (!building?.upgrade_finishes_at) return null;

		const finishTime = DateTime.fromISO(building.upgrade_finishes_at);
		if (!finishTime.isValid) return null;

		const remaining = finishTime.diff(now, ["hours", "minutes", "seconds"]);
		if (remaining.as("seconds") <= 0) return "Complete!";

		const hours = Math.floor(remaining.hours);
		const minutes = Math.floor(remaining.minutes);
		const seconds = Math.floor(remaining.seconds);

		if (hours > 0) return `${hours}h ${minutes}m remaining`;
		if (minutes > 0) return `${minutes}m ${seconds}s remaining`;
		return `${seconds}s remaining`;
	});

	function canUpgrade(bld: BuildingState): boolean {
		return (
			bld.upgrade_finishes_at == null &&
			bld.level < bld.max_level &&
			resources.food >= (bld.req_food ?? Infinity) &&
			resources.wood >= (bld.req_wood ?? Infinity) &&
			resources.stone >= (bld.req_stone ?? Infinity) &&
			resources.gold >= (bld.req_gold ?? Infinity)
		);
	}

	function canConfirm(): boolean {
		if (!building?.upgrade_finishes_at) return false;
		const finish_time = DateTime.fromISO(building.upgrade_finishes_at);
		if (!finish_time.isValid) return false;
		return now >= finish_time;
	}

	const isUpgrading = $derived(building?.upgrade_finishes_at != null);
	const isMaxLevel = $derived(building ? building.level >= building.max_level : false);

	const handleFormResult: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === "success") {
				await invalidateAll();
			}
		};
	};
</script>

<Dialog.Root {open} {onOpenChange}>
	<Dialog.Content class="max-w-md">
		{#if building}
			<Dialog.Header>
				<Dialog.Title class="flex items-center gap-2">
					{building.name}
					<span class="text-sm font-normal text-muted-foreground">
						Lv. {building.level}/{building.max_level}
					</span>
				</Dialog.Title>
				<Dialog.Description>
					{#if isMaxLevel}
						Maximum level reached
					{:else if isUpgrading}
						Upgrade in progress...
					{:else}
						Upgrade to increase production
					{/if}
				</Dialog.Description>
			</Dialog.Header>

			<div class="mt-6 space-y-6">
				<!-- Production Stats -->
				{#if building.food_per_hour || building.wood_per_hour || building.stone_per_hour || building.gold_per_hour || building.population_per_hour}
					<div>
						<h4 class="mb-3 text-sm font-medium">Production</h4>
						<div class="grid grid-cols-2 gap-3">
							{#if building.population_per_hour}
								<div class="flex items-center gap-2 text-sm">
									<span class="text-muted-foreground">Population:</span>
									<span class="font-medium">+{building.population_per_hour}</span>
								</div>
							{/if}
							{#if building.food_per_hour}
								<div class="flex items-center gap-2 text-sm">
									<Wheat class="size-4 text-amber-500" />
									<span class="font-medium">+{building.food_per_hour}/h</span>
								</div>
							{/if}
							{#if building.wood_per_hour}
								<div class="flex items-center gap-2 text-sm">
									<TreePine class="size-4 text-emerald-600" />
									<span class="font-medium">+{building.wood_per_hour}/h</span>
								</div>
							{/if}
							{#if building.stone_per_hour}
								<div class="flex items-center gap-2 text-sm">
									<Mountain class="size-4 text-slate-400" />
									<span class="font-medium">+{building.stone_per_hour}/h</span>
								</div>
							{/if}
							{#if building.gold_per_hour}
								<div class="flex items-center gap-2 text-sm">
									<Coins class="size-4 text-yellow-500" />
									<span class="font-medium">+{building.gold_per_hour}/h</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Upgrade Progress -->
				{#if isUpgrading}
					<div>
						<h4 class="mb-3 text-sm font-medium">Upgrade Progress</h4>
						<Progress value={upgradeProgress} class="h-2" />
						<p class="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
							<Clock class="size-4" />
							{remainingTime}
						</p>
					</div>
				{/if}

				<!-- Upgrade Cost -->
				{#if !isMaxLevel && !isUpgrading}
					<div>
						<h4 class="mb-3 text-sm font-medium">Upgrade to Level {building.level + 1}</h4>
						<div class="grid grid-cols-2 gap-3">
							<div class="flex items-center justify-between rounded-md bg-muted p-2">
								<div class="flex items-center gap-2">
									<Wheat class="size-4 text-amber-500" />
									<span class="text-sm">Food</span>
								</div>
								<span
									class="text-sm font-medium"
									class:text-destructive={resources.food < (building.req_food ?? 0)}
								>
									{building.req_food ?? 0}
								</span>
							</div>
							<div class="flex items-center justify-between rounded-md bg-muted p-2">
								<div class="flex items-center gap-2">
									<TreePine class="size-4 text-emerald-600" />
									<span class="text-sm">Wood</span>
								</div>
								<span
									class="text-sm font-medium"
									class:text-destructive={resources.wood < (building.req_wood ?? 0)}
								>
									{building.req_wood ?? 0}
								</span>
							</div>
							<div class="flex items-center justify-between rounded-md bg-muted p-2">
								<div class="flex items-center gap-2">
									<Mountain class="size-4 text-slate-400" />
									<span class="text-sm">Stone</span>
								</div>
								<span
									class="text-sm font-medium"
									class:text-destructive={resources.stone < (building.req_stone ?? 0)}
								>
									{building.req_stone ?? 0}
								</span>
							</div>
							<div class="flex items-center justify-between rounded-md bg-muted p-2">
								<div class="flex items-center gap-2">
									<Coins class="size-4 text-yellow-500" />
									<span class="text-sm">Gold</span>
								</div>
								<span
									class="text-sm font-medium"
									class:text-destructive={resources.gold < (building.req_gold ?? 0)}
								>
									{building.req_gold ?? 0}
								</span>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<Dialog.Footer class="mt-6">
				<form method="POST" action="/game?/upgrade" use:enhance={handleFormResult} class="w-full">
					<input name="bld_id" value={building.id} type="hidden" />
					{#if isUpgrading}
						<Button
							class="w-full"
							type="submit"
							formaction="/game?/confirm"
							disabled={!canConfirm()}
						>
							Confirm Upgrade
						</Button>
					{:else if isMaxLevel}
						<Button class="w-full" disabled>Max Level</Button>
					{:else}
						<Button variant="success" class="w-full" type="submit" disabled={!canUpgrade(building)}>
							Upgrade to Lv. {building.level + 1}
						</Button>
					{/if}
				</form>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
