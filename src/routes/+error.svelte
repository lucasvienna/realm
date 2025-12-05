<script lang="ts">
	import { page } from "$app/state";
	import { resolve } from "$app/paths";
	import { Button } from "$lib/components/ui/button";
	import Page404 from "$lib/components/page-404.svelte";
</script>

<main>
	<Page404>
		{#snippet title()}
			{page.status}
		{/snippet}
		{#snippet paragraph()}
			<p class="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
				Something went wrong.
			</p>
			<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
				{page.status === 404
					? "Sorry, we can't find that page. You'll find lots to explore on the home page."
					: page.error?.message}
			</p>
			<Button href={resolve("/")} size="lg" color="red">Back to Homepage</Button>
		{/snippet}
	</Page404>
</main>
