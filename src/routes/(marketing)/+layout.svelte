<script lang="ts">
	import MarketingHeader from "$lib/components/marketing-header.svelte";

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col items-center">
	<MarketingHeader />
	{@render children()}
</div>
