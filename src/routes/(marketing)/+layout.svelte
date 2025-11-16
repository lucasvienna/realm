<script lang="ts">
	import { resolve } from "$app/paths";
	import { Navbar, NavBrand, Button, NavHamburger, NavUl, NavLi } from "flowbite-svelte";

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col items-center">
	<header class="w-full">
		<Navbar>
			<NavBrand href="/">
				<img src="/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Empire Logo" />
				<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
					>Empire</span
				>
			</NavBrand>
			<div class="flex items-center lg:order-2">
				<Button href={resolve("/sign-in")} color="dark">Log in</Button>
				<Button href={resolve("/sign-up")} class="ml-2" color="red">Get started</Button>
				<NavHamburger />
			</div>
			<NavUl>
				<NavLi href={resolve("/")}>Home</NavLi>
				<NavLi href={resolve("/game")}>Game</NavLi>
				<NavLi href={resolve("/about")}>About</NavLi>
			</NavUl>
		</Navbar>
	</header>

	{@render children()}
</div>
