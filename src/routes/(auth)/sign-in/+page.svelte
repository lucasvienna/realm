<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";
	import * as Alert from "$lib/components/ui/alert";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import * as Field from "$lib/components/ui/field";
	import { Input } from "$lib/components/ui/input";
	import { Spinner } from "$lib/components/ui/spinner";
	import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
	import CrownIcon from "@lucide/svelte/icons/crown";
	import type { PageProps } from "./$types";

	let { form }: PageProps = $props();

	let submitting = $state(false);
</script>

<main class="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-background p-6">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>
				<div class="flex flex-col items-center gap-2 text-center">
					<a href={resolve("/")} class="flex flex-col items-center gap-2 font-medium">
						<div class="flex size-8 items-center justify-center rounded-md">
							<CrownIcon class="size-6" />
						</div>
						<span class="sr-only">Empire</span>
					</a>
					<h1 class="text-xl font-bold">Welcome to Empire</h1>
				</div>
			</Card.Title>
			<Card.Description class="text-center">
				<Field.Description>
					Don't have an account? <a href={resolve("/sign-up")}>Sign up</a>
				</Field.Description>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				method="POST"
				use:enhance={() => {
					submitting = true;

					return async ({ update }) => {
						await update({ invalidateAll: true });
						submitting = false;
					};
				}}
			>
				<Field.Group>
					<Field.Field>
						<Field.Label for="username">Username</Field.Label>
						<Input
							id="username"
							name="username"
							value={form?.username ?? ""}
							placeholder="me@example.com"
							autocomplete="username"
							required
						/>
					</Field.Field>
					<Field.Field>
						<Field.Label for="password">Password</Field.Label>
						<Input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
						/>
					</Field.Field>
					<Field.Field orientation="horizontal" class="-mt-5">
						<Checkbox
							id="remember"
							name="remember"
							checked={(form?.remember === true && true) || false}
						/>
						<Field.Label for="remember">Remember me?</Field.Label>
						<a
							href={resolve("/forgot-password")}
							class="ms-auto text-sm underline-offset-2 hover:underline"
						>
							Forgot your password?
						</a>
					</Field.Field>
					{#if form?.message != null && !submitting}
						<Alert.Root variant="destructive">
							<AlertCircleIcon />
							<Alert.Title>Error</Alert.Title>
							<Alert.Description>{form.message}</Alert.Description>
						</Alert.Root>
					{/if}
					<Field.Field>
						<Button type="submit" disabled={submitting}>
							{#if submitting}
								<Spinner />
							{/if}
							{submitting ? "Submitting..." : "Sign in"}
						</Button>
					</Field.Field>
					<Field.Separator class="uppercase">Or</Field.Separator>
					<Field.Field class="grid gap-4 sm:grid-cols-2">
						<Button variant="outline" type="button">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path
									d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
									fill="currentColor"
								/>
							</svg>
							Continue with Apple
						</Button>
						<Button variant="outline" type="button">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path
									d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
									fill="currentColor"
								/>
							</svg>
							Continue with Google
						</Button>
					</Field.Field>
				</Field.Group>
			</form>
			<Field.Description class="px-6 pt-4 text-center">
				By clicking continue, you agree to our <a href={resolve("/tos")}>Terms of Service</a> and
				<a href={resolve("/privacy")}>Privacy Policy</a>.
			</Field.Description>
		</Card.Content>
	</Card.Root>
</main>
