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
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>Create an account</Card.Title>
			<Card.Description>Enter your information below to create your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				method="POST"
				use:enhance={({ formData, cancel }) => {
					submitting = true;

					return async ({ result, update }) => {
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
							<Button variant="outline" type="button">Sign up with Google</Button>
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
