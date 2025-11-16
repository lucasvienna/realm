<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";
	import { Button, Checkbox, Helper, Input, Label } from "flowbite-svelte";
	import { Register, Section } from "flowbite-svelte-blocks";
	import type { PageProps } from "./$types";

	let { form }: PageProps = $props();
</script>

<Section
	name="login"
	class="flex min-h-screen w-full content-center items-center bg-gray-50 dark:bg-gray-900"
>
	<Register href={resolve("/")} class="w-full max-w-md">
		{#snippet top()}
			<img class="mr-2 h-8 w-8" src="/images/logo.svg" alt="logo" />
			Empire
		{/snippet}
		<div class="min-w-86 space-y-4 p-6 sm:p-8 md:space-y-6">
			<form class="flex flex-col space-y-6" method="POST" use:enhance>
				<h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">Login</h3>
				<Label class="space-y-2">
					<span>Username</span>
					<Input name="username" autocomplete="username" required />
				</Label>
				<Label class="space-y-2">
					<span>Password</span>
					<Input type="password" name="password" autocomplete="current-password" required />
					{#if form?.message}
						<Helper class="mt-2" color="red">{form.message}</Helper>
					{/if}
				</Label>
				<div class="flex items-start">
					<Checkbox name="remember">Remember me</Checkbox>
					<a
						href={resolve("/")}
						class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
					>
						Forgot password?
					</a>
				</div>
				<Button type="submit" class="w-full1">Sign in</Button>
				<p class="text-sm font-light text-gray-500 dark:text-gray-400">
					Don’t have an account yet? <a
						href={resolve("/sign-up")}
						class="text-primary-600 dark:text-primary-500 font-medium hover:underline">Sign up</a
					>
				</p>
			</form>
		</div>
	</Register>
</Section>
