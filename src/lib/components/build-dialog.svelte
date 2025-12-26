<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { buttonVariants } from "$lib/components/ui/button";
	import { getAvailableBuildings } from "../../routes/(app)/game/data.remote";

	// let props = $props();
	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Build</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Construct New Building</Dialog.Title>
		</Dialog.Header>
		{#each await getAvailableBuildings() as bld (bld.building.id)}
			<span>
				{bld.building.name}: {bld.buildable} |
				{bld.current_count}/{bld.max_count}
			</span>
		{/each}
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: "default" })}>Close</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
