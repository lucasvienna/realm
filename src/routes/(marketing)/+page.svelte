<script lang="ts">
	import { Button } from "$lib/components/ui/button";

	import ArrowRightOutline from "@lucide/svelte/icons/arrow-right";
</script>

<section class="grow bg-white dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 py-8 text-center lg:py-16">
		<h1
			class="mb-4 text-4xl leading-none font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
		>
			Build Your Empire. Conquer the World.
		</h1>
		<p
			class="mb-8 text-lg font-normal text-gray-500 sm:px-16 lg:px-48 lg:text-xl dark:text-gray-400"
		>
			Forge alliances, command armies, and expand your territory in this strategic empire building
			game. Start with a small settlement and rise to become the most powerful ruler in the realm.
		</p>
		<div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
			<Button href="/game" size="xl" color="red">
				Play Now
				<ArrowRightOutline class="-mr-1 ml-2 h-5 w-5" />
			</Button>
			<Button href="/about" size="xl" color="light">Learn More</Button>
		</div>
	</div>
</section>
