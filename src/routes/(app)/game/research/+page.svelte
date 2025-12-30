<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import FlaskConical from "@lucide/svelte/icons/flask-conical";
</script>

<div class="p-4 md:p-6">
	<div class="mx-auto max-w-4xl space-y-6">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Research</h1>
			<p class="text-sm text-muted-foreground">Unlock new technologies and upgrades</p>
		</div>

		<Card.Root>
			<Card.Header>
				<Card.Title>Technology Tree</Card.Title>
				<Card.Description>Research new technologies to advance your empire</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="py-8 text-center text-muted-foreground">
					<FlaskConical class="mx-auto mb-4 size-12 opacity-50" />
					<p>Tech tree coming soon</p>
					<p class="text-sm">Research agriculture, military, and economic technologies</p>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Current Research</Card.Title>
				<Card.Description>Technologies being researched</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-sm text-muted-foreground">No active research</p>
			</Card.Content>
		</Card.Root>
	</div>
</div>
