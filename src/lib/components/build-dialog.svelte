<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import type { SubmitFunction } from "@sveltejs/kit";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Card from "$lib/components/ui/card";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import Ban from "@lucide/svelte/icons/ban";
	import Building2 from "@lucide/svelte/icons/building-2";
	import FlaskConical from "@lucide/svelte/icons/flask-conical";
	import Wheat from "@lucide/svelte/icons/wheat";
	import TreePine from "@lucide/svelte/icons/tree-pine";
	import Mountain from "@lucide/svelte/icons/mountain";
	import Coins from "@lucide/svelte/icons/coins";
	import Clock from "@lucide/svelte/icons/clock";
	import type { BuildingLock, ConstructionInfo } from "$lib/domain/building";
	import type { ResourcesState } from "$lib/domain/resource";
	import type { Component } from "svelte";
	import {
		getAllBuildingDefinitions,
		getAvailableBuildings,
	} from "../../routes/(app)/game/data.remote";

	type BuildingNameMap = Map<number, string>;

	interface Props {
		resources: ResourcesState;
	}

	let { resources }: Props = $props();

	function canAfford(construction: ConstructionInfo): boolean {
		return (
			resources.food >= construction.food &&
			resources.wood >= construction.wood &&
			resources.stone >= construction.stone &&
			resources.gold >= construction.gold
		);
	}
	let open = $state(false);
	let buildingInProgress = $state<string | null>(null);

	function formatDuration(seconds: number): string {
		if (seconds < 60) return `${seconds}s`;
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		if (minutes < 60) {
			return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
		}
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
	}

	function getLockInfo(
		lock: BuildingLock,
		buildingNames: BuildingNameMap,
	): {
		icon: Component;
		message: string;
		severity: "muted" | "destructive" | "warning";
	} {
		switch (lock.kind) {
			case "MaxCountReached":
				return { icon: Ban, message: "Maximum buildings reached", severity: "muted" };
			case "BuildingLevelRequired": {
				const name = buildingNames.get(lock.building) ?? `Building #${lock.building}`;
				return {
					icon: Building2,
					message: `Requires ${name} level ${lock.required} (current: ${lock.current})`,
					severity: "destructive",
				};
			}
			case "TechNodeRequired":
				return {
					icon: FlaskConical,
					message: `Requires tech node ${lock.node_id}`,
					severity: "warning",
				};
			default:
				console.warn("Unknown lock type:", lock);
				return { icon: Ban, message: `Unknown requirement`, severity: "muted" };
		}
	}

	function handleConstruct(buildingId: string): SubmitFunction {
		return () => {
			buildingInProgress = buildingId;
			return async ({ result }) => {
				buildingInProgress = null;
				if (result.type === "success") {
					open = false;
					await invalidateAll();
				}
			};
		};
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Build</Dialog.Trigger>
	<Dialog.Content class="flex h-[90vh] w-[90vw] max-w-none flex-col sm:max-w-none">
		<Dialog.Header>
			<Dialog.Title>Construct New Building</Dialog.Title>
		</Dialog.Header>

		<div class="flex-1 overflow-y-auto pr-2">
			{#await Promise.all([getAvailableBuildings(), getAllBuildingDefinitions()])}
				<div class="flex h-full items-center justify-center">
					<p class="text-muted-foreground">Loading buildings...</p>
				</div>
			{:then [buildings, definitions]}
				{@const buildingNames = new Map(definitions.map((d) => [d.id, d.name]))}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each buildings as bld (bld.building.id)}
						<Card.Root
							class="h-full transition-shadow {bld.buildable ? 'hover:shadow-md' : 'opacity-75'}"
						>
							<Card.Header class="pb-2">
								<div class="flex items-center justify-between">
									<Card.Title class="text-lg">{bld.building.name}</Card.Title>
									<span class="text-sm text-muted-foreground">
										{bld.current_count}/{bld.max_count} built
									</span>
								</div>
								<!-- Instance progress bar -->
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
									<div
										class="h-full bg-primary transition-all"
										style="width: {(bld.current_count / bld.max_count) * 100}%"
									></div>
								</div>
							</Card.Header>

							<Card.Content class="space-y-3">
								<div>
									<div class="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
										<Clock class="size-4 text-blue-500" />
										<span>Build time: {formatDuration(bld.construction.time_seconds)}</span>
									</div>
									<p class="mb-2 text-sm font-medium">Build Cost:</p>
									<div class="grid grid-cols-2 gap-2 text-sm">
										<div
											class="flex items-center gap-2"
											class:text-emerald-600={resources.food >= bld.construction.food}
											class:text-destructive={resources.food < bld.construction.food}
										>
											<Wheat class="size-4 text-amber-500" />
											<span>Food: {bld.construction.food}</span>
										</div>
										<div
											class="flex items-center gap-2"
											class:text-emerald-600={resources.wood >= bld.construction.wood}
											class:text-destructive={resources.wood < bld.construction.wood}
										>
											<TreePine class="size-4 text-emerald-600" />
											<span>Wood: {bld.construction.wood}</span>
										</div>
										<div
											class="flex items-center gap-2"
											class:text-emerald-600={resources.stone >= bld.construction.stone}
											class:text-destructive={resources.stone < bld.construction.stone}
										>
											<Mountain class="size-4 text-slate-500" />
											<span>Stone: {bld.construction.stone}</span>
										</div>
										<div
											class="flex items-center gap-2"
											class:text-emerald-600={resources.gold >= bld.construction.gold}
											class:text-destructive={resources.gold < bld.construction.gold}
										>
											<Coins class="size-4 text-yellow-500" />
											<span>Gold: {bld.construction.gold}</span>
										</div>
									</div>
								</div>

								<!-- Lock reasons -->
								{#if bld.locks.length > 0}
									<Separator />
									<div class="space-y-1.5">
										{#each bld.locks as lock, i (i)}
											{@const info = getLockInfo(lock, buildingNames)}
											<div
												class="flex items-center gap-2 text-sm"
												class:text-muted-foreground={info.severity === "muted"}
												class:text-destructive={info.severity === "destructive"}
												class:text-amber-600={info.severity === "warning"}
											>
												<info.icon class="size-4" />
												<span>{info.message}</span>
											</div>
										{/each}
									</div>
								{/if}
							</Card.Content>

							<Card.Footer>
								{@const affordable = canAfford(bld.construction)}
								<form
									method="POST"
									action="/game?/construct"
									use:enhance={handleConstruct(bld.building.id)}
									class="w-full"
								>
									<input type="hidden" name="building_id" value={bld.building.id} />
									<Button
										type="submit"
										variant={bld.buildable && affordable ? "success" : "outline"}
										disabled={!bld.buildable ||
											!affordable ||
											buildingInProgress === bld.building.id}
										class="w-full"
									>
										{#if buildingInProgress === bld.building.id}
											Building...
										{:else}
											Build
										{/if}
									</Button>
								</form>
							</Card.Footer>
						</Card.Root>
					{/each}
				</div>
			{:catch error}
				<div class="flex h-full items-center justify-center">
					<p class="text-destructive">Failed to load buildings: {error.message}</p>
				</div>
			{/await}
		</div>

		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: "default" })}>Close</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
