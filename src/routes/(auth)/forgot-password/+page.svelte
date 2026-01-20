<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as Field from "$lib/components/ui/field";
	import { Input } from "$lib/components/ui/input";
	import KeyRoundIcon from "@lucide/svelte/icons/key-round";
</script>

<main class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>
				<div class="flex flex-row items-center justify-start gap-2">
					<KeyRoundIcon />
					<h1>Password Recovery</h1>
				</div>
			</Card.Title>
			<Card.Description>Enter your email to receive a password recovery link.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance>
				<Field.Group>
					<Field.Field>
						<Field.Label>Email</Field.Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="me@example.com"
							autocomplete="email"
							required
						/>
					</Field.Field>
					<Field.Field>
						<Button type="submit">Send Reset Link</Button>
					</Field.Field>
				</Field.Group>
				<Field.Separator class="mt-4 mb-2 uppercase">or</Field.Separator>
				<div class="flex flex-col items-center gap-2">
					<a href={resolve("/sign-in")} class="text-sm text-muted-foreground hover:underline">
						Back to Sign-in
					</a>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</main>
