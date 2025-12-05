<script lang="ts">
	import type { PageProps } from "./$types";
	import type { BuildingState } from "./game";
	import { enhance } from "$app/forms";
	import { DateTime } from "luxon";

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

<h2>Player: {player.name}</h2>
<h3>Faction: {player.faction}</h3>

<div class="container mt-2 flex max-w-200 flex-row gap-2">
	<Card class="p-2">Food:<br />{resources.food}/{resources.food_cap}</Card>
	<Card class="p-2">Wood:<br />{resources.wood}/{resources.wood_cap}</Card>
	<Card class="p-2">Stone:<br />{resources.stone}/{resources.stone_cap}</Card>
	<Card class="p-2">Gold:<br />{resources.gold}/{resources.gold_cap}</Card>
</div>

<div class="container mt-2 flex max-w-200 flex-row gap-2">
	<Card class="p-2">Food Production:<br />{resources.food_acc}/{resources.food_acc_cap}</Card>
	<Card class="p-2">Wood Production:<br />{resources.wood_acc}/{resources.wood_acc_cap}</Card>
	<Card class="p-2">Stone Production:<br />{resources.stone_acc}/{resources.stone_acc_cap}</Card>
	<Card class="p-2">Gold Production:<br />{resources.gold_acc}/{resources.gold_acc_cap}</Card>
</div>

<form method="POST" action="?/collect" use:enhance>
	<Button class="mt-4" type="submit" color="blue">Collect</Button>
</form>

<br />

<Button>Build</Button>
<Dropdown simple>
	<DropdownItem>Dashboard</DropdownItem>
	<DropdownItem>Settings</DropdownItem>
	<DropdownItem>Earnings</DropdownItem>
	<DropdownItem>Sign out</DropdownItem>
</Dropdown>

<h3 class="mt-6">Buildings</h3>
<div class="container mt-2 flex flex-row justify-center gap-2">
	{#each buildingsEntries as [bldId, blds] (bldId)}
		{#if !blds || blds.length === 0}
			<Alert color="blue">No buildings found for ID: {bldId}</Alert>
		{:else}
			<div>
				<h3>Building ID: {bldId}</h3>
				<h5>Building Count: {blds.length}/{blds[0].max_count}</h5>
				{#each blds as bld (bld.id)}
					<div class="flex flex-col gap-2">
						<form method="POST" action="?/upgrade" use:enhance>
							<Card class="p-2">
								<h5>{bld.name}</h5>
								<p>Level: {bld.level}/{bld.max_level}</p>
								<p class="mt-2">Upgrade Requirements:</p>
								<ul>
									<li>Food: {bld.req_food}</li>
									<li>Wood: {bld.req_wood}</li>
									<li>Stone: {bld.req_stone}</li>
									<li>Gold: {bld.req_gold}</li>
								</ul>
								<input name="bld_id" value={bld.id} type="hidden" />
								{#if bld.upgrade_finishes_at}
									<Button
										color="cyan"
										class="mt-1"
										type="submit"
										formaction="?/confirm"
										disabled={!canConfirm(bld)}
									>
										Confirm
									</Button>
								{:else}
									<Button color="green" class="mt-2" type="submit" disabled={!canUpgrade(bld)}>
										Upgrade
									</Button>
								{/if}
							</Card>
						</form>
					</div>
				{/each}
			</div>
		{/if}
	{/each}
</div>
