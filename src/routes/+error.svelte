<script lang="ts">
	import { Section, Page404 } from "flowbite-svelte-blocks";
	import { Button } from "flowbite-svelte";
	import { page } from "$app/state";
	import { resolve } from "$app/paths";
</script>

<Section name="page404">
	<Page404>
		{#snippet h1()}
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
</Section>
