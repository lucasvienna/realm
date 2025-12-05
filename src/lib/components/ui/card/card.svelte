<!--
@component
Container for grouped content with consistent styling.

@example
```svelte
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>Main content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

@prop {string} class - Additional CSS classes
@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		"flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
		className,
	)}
	{...restProps}
>
	{@render children?.()}
</div>
