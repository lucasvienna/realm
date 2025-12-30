<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs";
	import Users from "@lucide/svelte/icons/users";
	import Trophy from "@lucide/svelte/icons/trophy";
</script>

<div class="p-4 md:p-6">
	<div class="mx-auto max-w-4xl space-y-6">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Social</h1>
			<p class="text-sm text-muted-foreground">Guilds, leaderboards, and trading</p>
		</div>

		<Tabs.Root value="guild">
			<Tabs.List class="grid w-full grid-cols-4">
				<Tabs.Trigger value="guild">Guild</Tabs.Trigger>
				<Tabs.Trigger value="leaderboard">Leaderboard</Tabs.Trigger>
				<Tabs.Trigger value="trade">Trade</Tabs.Trigger>
				<Tabs.Trigger value="friends">Friends</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="guild" class="mt-4">
				<Card.Root>
					<Card.Content class="pt-6">
						<div class="py-8 text-center text-muted-foreground">
							<Users class="mx-auto mb-4 size-12 opacity-50" />
							<p>Guild system coming soon</p>
							<p class="text-sm">Join or create a guild to collaborate with others</p>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<Tabs.Content value="leaderboard" class="mt-4">
				<Card.Root>
					<Card.Content class="pt-6">
						<div class="py-8 text-center text-muted-foreground">
							<Trophy class="mx-auto mb-4 size-12 opacity-50" />
							<p>Leaderboard coming soon</p>
							<p class="text-sm">Compete with other players for top rankings</p>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<Tabs.Content value="trade" class="mt-4">
				<Card.Root>
					<Card.Content class="pt-6">
						<p class="py-8 text-center text-sm text-muted-foreground">Trading coming soon</p>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<Tabs.Content value="friends" class="mt-4">
				<Card.Root>
					<Card.Content class="pt-6">
						<p class="py-8 text-center text-sm text-muted-foreground">Friends list coming soon</p>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
