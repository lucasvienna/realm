<script lang="ts">
	import { enhance } from "$app/forms";
	import ResourceDisplay from "$lib/components/resource-display.svelte";
	import * as Alert from "$lib/components/ui/alert";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import Coins from "@lucide/svelte/icons/coins";
	import Mountain from "@lucide/svelte/icons/mountain";
	import TreePine from "@lucide/svelte/icons/tree-pine";
	import Wheat from "@lucide/svelte/icons/wheat";
	import { DateTime } from "luxon";
	import type { PageProps } from "./$types";
	import type { BuildingState } from "./game";

	let { data }: PageProps = $props();

	const resources = $derived(data.gameData.resources);
	const player = $derived(data.gameData.player);
	const buildingsEntries = $derived(Object.entries(data.gameData.buildings));

	function canUpgrade(building: BuildingState): boolean {
		return (
			building.upgrade_finishes_at == null && // upgrade already in progress
			building.level < building.max_level &&
			resources.food >= (building.req_food ?? Infinity) &&
			resources.wood >= (building.req_wood ?? Infinity) &&
			resources.stone >= (building.req_stone ?? Infinity) &&
			resources.gold >= (building.req_gold ?? Infinity)
		);
	}

	function canConfirm(bld: BuildingState): boolean {
		if (!bld.upgrade_finishes_at) return false;
		const finish_time = DateTime.fromISO(bld.upgrade_finishes_at);
		if (!finish_time.isValid) return false;

		return DateTime.now() >= finish_time;
	}
</script>

<div class="min-h-svh bg-muted/40 p-4 md:p-8">
	<div class="mx-auto max-w-4xl space-y-6">
		<!-- Page Header -->
		<div>
			<h1 class="text-3xl font-bold tracking-tight">{player.name}'s Realm</h1>
			<p class="text-muted-foreground capitalize">Faction: {player.faction}</p>
		</div>

		<!-- Resources Card -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Resources</Card.Title>
				<Card.Description>Your current stockpile and production</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
					<ResourceDisplay
						name="Food"
						icon={Wheat}
						current={resources.food}
						cap={resources.food_cap}
						production={resources.food_acc}
						productionCap={resources.food_acc_cap}
						color="amber"
					/>
					<ResourceDisplay
						name="Wood"
						icon={TreePine}
						current={resources.wood}
						cap={resources.wood_cap}
						production={resources.wood_acc}
						productionCap={resources.wood_acc_cap}
						color="emerald"
					/>
					<ResourceDisplay
						name="Stone"
						icon={Mountain}
						current={resources.stone}
						cap={resources.stone_cap}
						production={resources.stone_acc}
						productionCap={resources.stone_acc_cap}
						color="slate"
					/>
					<ResourceDisplay
						name="Gold"
						icon={Coins}
						current={resources.gold}
						cap={resources.gold_cap}
						production={resources.gold_acc}
						productionCap={resources.gold_acc_cap}
						color="yellow"
					/>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Actions Card -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Actions</Card.Title>
				<Card.Description>Manage your realm</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-wrap gap-3">
					<form method="POST" action="?/collect" use:enhance>
						<Button type="submit" variant="info">Collect Resources</Button>
					</form>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="outline">Build</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Item>Dashboard</DropdownMenu.Item>
							<DropdownMenu.Item>Settings</DropdownMenu.Item>
							<DropdownMenu.Item>Earnings</DropdownMenu.Item>
							<DropdownMenu.Item>Sign out</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Buildings Section -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Buildings</Card.Title>
				<Card.Description>Upgrade your structures to grow your empire</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if buildingsEntries.length === 0}
					<Alert.Root>
						<Alert.Description>No buildings available yet.</Alert.Description>
					</Alert.Root>
				{:else}
					<div
						class="grid gap-4"
						style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));"
					>
						{#each buildingsEntries as [bldId, blds] (bldId)}
							{#if !blds || blds.length === 0}
								<Alert.Root>
									<Alert.Description>No buildings found for ID: {bldId}</Alert.Description>
								</Alert.Root>
							{:else}
								{#each blds as bld (bld.id)}
									<Card.Root class="flex flex-col">
										<Card.Header class="pb-2">
											<Card.Title class="text-lg">{bld.name}</Card.Title>
											<Card.Description>
												Level {bld.level} / {bld.max_level}
											</Card.Description>
										</Card.Header>
										<Card.Content class="flex-1">
											{#if bld.level < bld.max_level && !bld.upgrade_finishes_at}
												<p class="mb-2 text-sm font-medium">Upgrade Cost:</p>
												<div class="grid grid-cols-2 gap-2 text-sm">
													<div class="flex justify-between">
														<span class="text-muted-foreground">Food:</span>
														<span class:text-destructive={resources.food < (bld.req_food ?? 0)}>
															{bld.req_food ?? 0}
														</span>
													</div>
													<div class="flex justify-between">
														<span class="text-muted-foreground">Wood:</span>
														<span class:text-destructive={resources.wood < (bld.req_wood ?? 0)}>
															{bld.req_wood ?? 0}
														</span>
													</div>
													<div class="flex justify-between">
														<span class="text-muted-foreground">Stone:</span>
														<span class:text-destructive={resources.stone < (bld.req_stone ?? 0)}>
															{bld.req_stone ?? 0}
														</span>
													</div>
													<div class="flex justify-between">
														<span class="text-muted-foreground">Gold:</span>
														<span class:text-destructive={resources.gold < (bld.req_gold ?? 0)}>
															{bld.req_gold ?? 0}
														</span>
													</div>
												</div>
											{:else if bld.upgrade_finishes_at}
												<p class="text-sm text-muted-foreground">Upgrade in progress...</p>
											{:else}
												<p class="text-sm text-muted-foreground">Maximum level reached</p>
											{/if}
										</Card.Content>
										<Card.Footer>
											<form method="POST" action="?/upgrade" use:enhance class="w-full">
												<input name="bld_id" value={bld.id} type="hidden" />
												{#if bld.upgrade_finishes_at}
													<Button
														class="w-full"
														type="submit"
														formaction="?/confirm"
														disabled={!canConfirm(bld)}
													>
														Confirm Upgrade
													</Button>
												{:else}
													<Button
														variant="success"
														class="w-full"
														type="submit"
														disabled={!canUpgrade(bld)}
													>
														Upgrade
													</Button>
												{/if}
											</form>
										</Card.Footer>
									</Card.Root>
								{/each}
							{/if}
						{/each}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>
