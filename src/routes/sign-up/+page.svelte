<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import * as Field from "$lib/components/ui/field";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Spinner } from "$lib/components/ui/spinner";

	const { form } = $props();
	let submitting = $state(false);
</script>

<main class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
	<Card.Root class="w-full max-w-lg">
		<Card.Header>
			<Card.Title>Create an account</Card.Title>
			<Card.Description>Enter your information below to create your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				method="POST"
				use:enhance={() => {
					submitting = true;

					return async ({ update }) => {
						await update();
						submitting = false;
					};
				}}
			>
				<Field.Group>
					{#if form?.disagreed}<p class="error">You must agree to the terms!</p>{/if}
					<Field.Field>
						<Field.Label for="name">Username</Field.Label>
						<Input
							id="username"
							name="username"
							type="text"
							placeholder="Emperor"
							minlength={3}
							value={form?.username ?? ""}
							required
						/>
					</Field.Field>
					<Field.Field>
						<Field.Label for="email">Email</Field.Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="me@example.com"
							value={form?.email ?? ""}
							required
						/>
						<Field.Description>
							We'll use this to contact you. We will not share your email with anyone else.
						</Field.Description>
					</Field.Field>
					<Field.FieldGroup>
						<Field.Field class="grid grid-cols-2 gap-4">
							<Field.Field>
								<Field.Label for="password">Password</Field.Label>
								<Input id="password" name="password" type="password" minlength={8} required />
								{#if !!form?.mismatch}
									<Field.Error>Passwords must match.</Field.Error>
								{/if}
							</Field.Field>
							<Field.Field>
								<Field.Label for="confirm-password">Confirm Password</Field.Label>
								<Input
									id="confirm-password"
									name="confirm-password"
									type="password"
									minlength={8}
									required
									data-invalid={!!form?.missing}
								/>
							</Field.Field>
						</Field.Field>
						<Field.Description>Must be at least 8 characters long.</Field.Description>
					</Field.FieldGroup>
					<Field.Field orientation="horizontal" class="flex items-start gap-2">
						<Checkbox name="terms" checked={form?.termsAccepted} required />
						<Label>
							I accept the&nbsp;<a
								class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
								href={resolve("/tos")}>Terms and Conditions</a
							>
						</Label>
					</Field.Field>
					<Field.Group>
						<Field.Field>
							<Button type="submit" disabled={submitting}>
								{#if submitting}
									<Spinner />
								{/if}
								{submitting ? "Creating..." : "Create Account"}
							</Button>
							<Field.Field class="grid gap-4 sm:grid-cols-2">
								<Button variant="outline" type="button">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<path
											d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
											fill="currentColor"
										/>
									</svg>
									Sign up with Apple
								</Button>
								<Button variant="outline" type="button">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									Sign up with Google
								</Button>
							</Field.Field>
							<Field.Description class="px-6 text-center">
								Already have an account? <a href={resolve("/sign-in")}>Sign in</a>
							</Field.Description>
						</Field.Field>
					</Field.Group>
				</Field.Group>
			</form>
		</Card.Content>
	</Card.Root>
</main>

<style>
	.error {
		color: var(--color-red-600);
	}
</style>
