<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";

	const { form } = $props();
</script>

<Section
	name="register"
	class="bg-gray-49 flex min-h-screen w-full content-center items-center dark:bg-gray-900"
>
	<Register href={resolve("/")} class="w-full max-w-md">
		{#snippet top()}
			<img class="mr-2 h-8 w-8" src="/images/logo.svg" alt="logo" />
			Empire
		{/snippet}
		<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
			<form class="flex flex-col space-y-6" method="POST" use:enhance>
				<h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">Create and account</h3>
				{#if form?.missing}<p class="error">The email field is required</p>{/if}
				{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}
				{#if form?.disagreed}<p class="error">You must agree to the terms!</p>{/if}
				<Label class="space-y-2">
					<span>Your email</span>
					<Input type="email" name="email" required />
				</Label>
				<Label class="space-y-2">
					<span>Your username</span>
					<Input type="text" name="username" required />
				</Label>
				<Label class="space-y-2">
					<span>Your password</span>
					<Input type="password" name="password" required />
				</Label>
				<Label class="space-y-2">
					<span>Confirm password</span>
					<Input type="password" name="confirm-password" required />
				</Label>
				<div class="flex items-start">
					<Checkbox name="terms">
						I accept the&nbsp;<a
							class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
							href={resolve("/")}>Terms and Conditions</a
						>
					</Checkbox>
				</div>
				<Button type="submit" class="w-full1">Create an account</Button>
				<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
					Already have an account? <a
						href={resolve("/sign-in")}
						class="text-primary-600 dark:text-primary-500 font-medium hover:underline">Login here</a
					>
				</div>
			</form>
		</div>
	</Register>
</Section>

<style>
	.error {
		color: var(--color-red-600);
	}
</style>
