<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>Hi, {data.user.name}!</h1>
<p>Your user ID is <span class="font-mono text-fuchsia-800">{data.user.id}</span>.</p>

<p class="mt-2">Navigate to <a href="/game">Main Game</a>.</p>
<form method="post" action="?/logout" use:enhance class="mt-2">
	<button
		class="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
	>
		Sign out
	</button>
</form>
