<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import Swords from "@lucide/svelte/icons/swords";
</script>

<div class="p-4 md:p-6">
	<div class="mx-auto max-w-4xl space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold tracking-tight">Army</h1>
				<p class="text-sm text-muted-foreground">Train and manage your forces</p>
			</div>
			<Button variant="destructive">
				<Swords class="mr-2 size-4" />
				Attack
			</Button>
		</div>

		<Card.Root>
			<Card.Header>
				<Card.Title>Your Forces</Card.Title>
				<Card.Description>Units available for combat</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="py-8 text-center text-muted-foreground">
					<Swords class="mx-auto mb-4 size-12 opacity-50" />
					<p>Army management coming soon</p>
					<p class="text-sm">Train units, manage troops, and launch attacks</p>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Training Queue</Card.Title>
				<Card.Description>Units currently in training</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-sm text-muted-foreground">No units in training</p>
			</Card.Content>
		</Card.Root>
	</div>
</div>
