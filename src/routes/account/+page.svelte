<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>Hi, {data.user.name}!</h1>
<p>Your user ID is <span class="font-mono text-fuchsia-800">{data.user.id}</span>.</p>

<p class="mt-2 text-lg">
	Faction: <span class="font-mono text-base text-green-900">{data.user.faction}</span>.
</p>

{#if data.user.faction === 'Neutral'}
	<p class="mt-2">You can join a faction by clicking the button below.</p>
	<form class="mt-2" method="post" action="?/join_faction" use:enhance>
		<select name="faction" class="mb-2 w-36 rounded-md border border-gray-300 p-2">
			<option value="human">Humans</option>
			<option value="orc">Orcs</option>
			<option value="elf">Elves</option>
			<option value="dwarf">Dwarves</option>
		</select>
		<button
			class="cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
		>
			Join a faction
		</button>
	</form>
{:else}
	<p class="mt-2">Navigate to <a href="/game">Main Game</a>.</p>
{/if}

<form class="mt-4" method="post" action="?/logout" use:enhance>
	<button
		class="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
	>
		Sign out
	</button>
</form>
