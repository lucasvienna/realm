<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Section, Register } from 'flowbite-svelte-blocks';
	import { Button, Checkbox, Label, Input, Helper } from 'flowbite-svelte';

	let { form }: { form: ActionData } = $props();
</script>

<Section
	name="login"
	class="flex min-h-screen w-full content-center items-center bg-gray-50 dark:bg-gray-900"
>
	<Register class="w-full max-w-md">
		<div class="min-w-86 space-y-4 p-6 sm:p-8 md:space-y-6">
			<form class="flex flex-col space-y-6" method="post" action="?/login" use:enhance>
				<h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">Login</h3>
				<Label class="space-y-2">
					<span>Username</span>
					<Input name="username" autocomplete="username" required />
				</Label>
				<Label class="space-y-2">
					<span>Password</span>
					<Input type="password" name="password" autocomplete="current-password" required />
					<Helper class="mt-2" color="red">{form?.message ?? ''}</Helper>
				</Label>
				<div class="flex items-start">
					<Checkbox name="remember">Remember me</Checkbox>
					<a href="/" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">
						Forgot password?
					</a>
				</div>
				<Button type="submit" class="w-full1">Sign in</Button>
				<Button type="submit" formaction="?/register" class="w-full1">Register</Button>
			</form>
		</div>
	</Register>
</Section>
