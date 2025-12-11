<script lang="ts">
	import { resolve } from "$app/paths";
	import { Button } from "./ui/button";
	import * as Sheet from "./ui/sheet";
	import MenuIcon from "@lucide/svelte/icons/menu";

	let sheetOpen = $state(false);
</script>

<header class="w-full border-b bg-background">
	<nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
		<!-- Logo -->
		<a href={resolve("/")} class="flex items-center gap-2">
			<img class="mr-2 h-8 w-8" src="/images/logo.svg" alt="logo" />
			<span class="text-xl font-semibold whitespace-nowrap">Empire</span>
		</a>

		<!-- Desktop nav links (hidden on mobile) -->
		<div class="hidden items-center gap-6 md:flex">
			<a href={resolve("/")} class="text-sm font-medium hover:text-primary">Home</a>
			<a href={resolve("/game")} class="text-sm font-medium hover:text-primary">Game</a>
			<a href={resolve("/about")} class="text-sm font-medium hover:text-primary">About</a>
		</div>

		<!-- Desktop buttons (hidden on mobile) -->
		<div class="hidden items-center gap-2 md:flex">
			<Button href={resolve("/sign-in")} variant="secondary">Log in</Button>
			<Button href={resolve("/sign-up")} variant="destructive">Get started</Button>
		</div>

		<!-- Mobile Hamburger -> Sheet -->
		<div class="md:hidden">
			<Sheet.Root bind:open={sheetOpen}>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="icon">
							<MenuIcon class="size-5" />
							<span class="sr-only">Toggle menu</span>
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="right" class="w-[300px]">
					<Sheet.Header>
						<Sheet.Title>Menu</Sheet.Title>
					</Sheet.Header>
					<nav class="mt-6 flex flex-col gap-4">
						<a
							href={resolve("/")}
							class="text-lg font-medium hover:text-primary"
							onclick={() => (sheetOpen = false)}
						>
							Home
						</a>
						<a
							href={resolve("/game")}
							class="text-lg font-medium hover:text-primary"
							onclick={() => (sheetOpen = false)}
						>
							Game
						</a>
						<a
							href={resolve("/about")}
							class="text-lg font-medium hover:text-primary"
							onclick={() => (sheetOpen = false)}
						>
							About
						</a>
						<div class="mt-4 flex flex-col gap-2">
							<Button
								href={resolve("/sign-in")}
								variant="secondary"
								onclick={() => (sheetOpen = false)}
							>
								Log in
							</Button>
							<Button
								href={resolve("/sign-up")}
								variant="destructive"
								onclick={() => (sheetOpen = false)}
							>
								Get started
							</Button>
						</div>
					</nav>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</nav>
</header>
