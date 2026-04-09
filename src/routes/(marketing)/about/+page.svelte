<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import Award from "@lucide/svelte/icons/award";
	import Globe from "@lucide/svelte/icons/globe";
	import Landmark from "@lucide/svelte/icons/landmark";
	import Users from "@lucide/svelte/icons/users";
	import ShieldCheck from "@lucide/svelte/icons/shield-check";
	import VectorSquare from "@lucide/svelte/icons/vector-square";
</script>

<!-- Content Section -->
<section>
	<div class="mx-auto max-w-7xl px-4 py-8 sm:py-16 lg:px-6">
		<div class="mb-8 max-w-3xl lg:mb-16">
			<h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
				About Empire
			</h2>
			<p class="text-gray-500 sm:text-xl dark:text-gray-400">
				Empire is a strategic multiplayer game where you build and expand your civilization from a
				humble settlement into a dominant world power. Inspired by classic empire builders like
				Ikariam, Tribal Wars, and Clash of Clans, our game combines deep strategic gameplay with
				accessible mechanics that anyone can enjoy.
			</p>
		</div>
		<div class="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Build Your Civilization</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Start with a small settlement and grow it into a thriving empire. Construct buildings,
					gather resources, and research technologies to unlock new possibilities for your
					civilization.
				</p>
			</div>
			<div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Strategic Warfare</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Train powerful armies, forge alliances with other players, and conquer territories. Every
					battle requires careful planning and tactical decision-making to ensure victory.
				</p>
			</div>
		</div>
		<div class="mt-8">
			<Button href="/sign-up" size="lg" color="red">Start Your Empire</Button>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="bg-gray-50 dark:bg-gray-800">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:py-16 lg:px-6">
		<div class="mb-8 max-w-3xl lg:mb-16">
			<h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
				Game Features
			</h2>
			<p class="text-gray-500 sm:text-xl dark:text-gray-400">
				Discover what makes Empire an engaging and strategic gaming experience
			</p>
		</div>
		<div class="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
			<div>
				<div
					class="bg-primary-100 dark:bg-primary-900 mb-4 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12"
				>
					<Landmark class="text-primary-600 dark:text-primary-300 h-5 w-5 lg:h-6 lg:w-6" />
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Resource Management</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Gather and manage multiple resources to fuel your empire's growth. Balance production,
					consumption, and storage to maintain a thriving economy.
				</p>
			</div>
			<div>
				<div
					class="bg-primary-100 dark:bg-primary-900 mb-4 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12"
				>
					<Users class="text-primary-600 dark:text-primary-300 h-5 w-5 lg:h-6 lg:w-6" />
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Alliances</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Form powerful alliances with other players. Coordinate strategies, share resources, and
					dominate the world together through teamwork and diplomacy.
				</p>
			</div>
			<div>
				<div
					class="bg-primary-100 dark:bg-primary-900 mb-4 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12"
				>
					<Award class="text-primary-600 dark:text-primary-300 h-5 w-5 lg:h-6 lg:w-6" />
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Competitive Rankings</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Climb the leaderboards and prove your worth as a ruler. Compete for glory through military
					might, economic power, or technological advancement.
				</p>
			</div>
			<div>
				<div
					class="bg-primary-100 dark:bg-primary-900 mb-4 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12"
				>
					<VectorSquare class="text-primary-600 dark:text-primary-300 h-5 w-5 lg:h-6 lg:w-6" />
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Technology Tree</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Research advanced technologies to unlock new buildings, units, and abilities. Choose your
					path wisely to gain strategic advantages over your rivals.
				</p>
			</div>
			<div>
				<div
					class="bg-primary-100 dark:bg-primary-900 mb-4 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12"
				>
					<ShieldCheck class="text-primary-600 dark:text-primary-300 h-5 w-5 lg:h-6 lg:w-6" />
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Defense Systems</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Build fortifications and defenses to protect your empire from enemy attacks. A strong
					defense is just as important as a powerful offense.
				</p>
			</div>
			<div>
				<div
					class="bg-primary-100 dark:bg-primary-900 mb-4 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12"
				>
					<Globe class="text-primary-600 dark:text-primary-300 h-5 w-5 lg:h-6 lg:w-6" />
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Vast World</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Explore and expand across a massive world map. Discover new territories, claim valuable
					resources, and establish your presence across the realm.
				</p>
			</div>
		</div>
	</div>
</section>
