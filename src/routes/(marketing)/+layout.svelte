<script lang="ts">
	import MarketingHeader from "$lib/components/marketing-header.svelte";

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col items-center dark:bg-gray-900">
	<MarketingHeader />
	{@render children()}
</div>
