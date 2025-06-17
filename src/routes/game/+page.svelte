<script lang="ts">
	import type { PageServerData } from './$types';
	import { Alert, Button, Card, Dropdown, DropdownItem } from 'flowbite-svelte';
	import type { BuildingState } from './+page.server';

	let { data }: { data: PageServerData } = $props();
	console.log('Game Page Data:', data);

	const resources = data.gameData.resources;
	const player = data.gameData.player;
	const buildings = data.gameData.buildings;
	const buildingsEntries = Object.entries(buildings);
	console.log('Buildings Entries:', ...buildingsEntries);

	function canUpgrade(building: BuildingState) {
		return (
			building.level < building.max_level &&
			resources.food >= (building.req_food ?? Infinity) &&
			resources.wood >= (building.req_wood ?? Infinity) &&
			resources.stone >= (building.req_stone ?? Infinity) &&
			resources.gold >= (building.req_gold ?? Infinity)
		);
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

<Button
	class="mt-4"
	color="blue"
	onclick={async () => {
		const res = await fetch('/api/game/resources/collect', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		console.log('Collect resources response:', res);
		if (res.ok) {
			const body = await res.json();
			console.log('Collected resources:', body);
			// Optionally, you can refresh the page or update the state
			window.location.reload();
		} else {
			console.error('Failed to collect resources:', res.statusText);
		}
	}}
>
	Collect
</Button>

<Button>Build</Button>
<Dropdown simple>
	<DropdownItem>Dashboard</DropdownItem>
	<DropdownItem>Settings</DropdownItem>
	<DropdownItem>Earnings</DropdownItem>
	<DropdownItem>Sign out</DropdownItem>
</Dropdown>

<h3 class="mt-6">Buildings</h3>
<div class="container mt-2 flex flex-row justify-center gap-2">
	{#each buildingsEntries as [bldId, blds]}
		{#if !blds || blds.length === 0}
			<Alert color="blue">No buildings found for ID: {bldId}</Alert>
		{:else}
			<div>
				<h3>Building ID: {bldId}</h3>
				<h5>Building Count: {blds.length}/{blds[0].max_count}</h5>
				{#each blds as bld}
					<div class="flex flex-col gap-2">
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
							<Button
								color="green"
								class="mt-2"
								disabled={bld.level >= bld.max_level || !canUpgrade(bld)}
								onclick={async () => {
									const response = await fetch(`/api/game/buildings/${bld.id}/upgrade`, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
									});
									const body = await response.json();
									if (response.ok) {
										console.log('Upgrade successful:', body);
										// Optionally, you can refresh the page or update the state
										window.location.reload();
									} else {
										console.error('Upgrade failed:', body);
									}
								}}
							>
								Upgrade
							</Button>
						</Card>
					</div>
				{/each}
			</div>
		{/if}
	{/each}
</div>
