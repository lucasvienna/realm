<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import type { PageServerData } from "./$types";

	let { data }: { data: PageServerData } = $props();
	let factions = $derived(data.factions);
</script>

<div class="min-h-svh bg-muted/40 p-4 md:p-8">
	<div class="mx-auto max-w-4xl space-y-6">
		<!-- Page Header -->
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Account Settings</h1>
			<p class="text-muted-foreground">Manage your profile and preferences</p>
		</div>

		<!-- Profile Card -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Profile</Card.Title>
				<Card.Description>Your player information</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex items-center gap-4">
					<!-- Avatar placeholder -->
					<div
						class="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground"
					>
						{data.user.name.charAt(0).toUpperCase()}
					</div>
					<div>
						<p class="text-lg font-semibold">{data.user.name}</p>
						<p class="font-mono text-sm text-muted-foreground">{data.user.id}</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Two-column grid for smaller cards -->
		<div class="grid gap-6 md:grid-cols-2">
			<!-- Faction Card -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Faction</Card.Title>
					<Card.Description>Your allegiance in the realm</Card.Description>
				</Card.Header>
				<Card.Content>
					{#if data.user.faction === "Neutral"}
						<p class="mb-4 text-muted-foreground">
							You haven't joined a faction yet. Choose your allegiance!
						</p>
						<form method="POST" action="?/join_faction" use:enhance>
							<select
								name="faction"
								class="mb-3 w-full rounded-md border border-input bg-background px-3 py-2"
							>
								{#each factions as faction (faction.id)}
									<option value={faction.id}>{faction.name}</option>
								{/each}
							</select>
							<Button type="submit" variant="success" class="w-full">Join Faction</Button>
						</form>
					{:else}
						<div class="flex items-center gap-3">
							<div
								class="flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30"
							>
								<!-- TODO: Add faction-specific icons/colors -->
								<span class="text-lg">⚔️</span>
							</div>
							<div>
								<p class="font-semibold capitalize">{data.user.faction}</p>
								<p class="text-sm text-muted-foreground">Active member</p>
							</div>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>

			<!-- Actions Card -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Quick Actions</Card.Title>
					<Card.Description>Navigate or manage your account</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-3">
					{#if data.user.faction !== "Neutral"}
						<Button href={resolve("/game")} variant="default" class="w-full">
							Enter the Realm
						</Button>
					{/if}
					<Separator />
					<form method="post" action="?/logout" use:enhance>
						<Button type="submit" variant="outline" class="w-full">Sign Out</Button>
					</form>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
