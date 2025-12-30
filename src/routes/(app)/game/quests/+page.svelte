<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs";
	import Scroll from "@lucide/svelte/icons/scroll";
</script>

<div class="p-4 md:p-6">
	<div class="mx-auto max-w-4xl space-y-6">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Quests</h1>
			<p class="text-sm text-muted-foreground">Complete objectives to earn rewards</p>
		</div>

		<Tabs.Root value="building">
			<Tabs.List class="grid w-full grid-cols-4">
				<Tabs.Trigger value="building">Building</Tabs.Trigger>
				<Tabs.Trigger value="research">Research</Tabs.Trigger>
				<Tabs.Trigger value="combat">Combat</Tabs.Trigger>
				<Tabs.Trigger value="daily">Daily</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="building" class="mt-4">
				<Card.Root>
					<Card.Content class="pt-6">
						<div class="py-8 text-center text-muted-foreground">
							<Scroll class="mx-auto mb-4 size-12 opacity-50" />
							<p>Building quests coming soon</p>
							<p class="text-sm">Upgrade buildings to complete objectives</p>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<Tabs.Content value="research" class="mt-4">
				<Card.Root>
					<Card.Content class="pt-6">
						<p class="py-8 text-center text-sm text-muted-foreground">
							Research quests coming soon
						</p>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<Tabs.Content value="combat" class="mt-4">
				<Card.Root>
					<Card.Content class="pt-6">
						<p class="py-8 text-center text-sm text-muted-foreground">Combat quests coming soon</p>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<Tabs.Content value="daily" class="mt-4">
				<Card.Root>
					<Card.Content class="pt-6">
						<p class="py-8 text-center text-sm text-muted-foreground">Daily quests coming soon</p>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
