<!--
@component
Empty state container for when there's no data to display.

@example
```svelte
<Empty>
  <EmptyMedia variant="icon"><InboxIcon /></EmptyMedia>
  <EmptyContent>
    <EmptyHeader>
      <EmptyTitle>No messages</EmptyTitle>
      <EmptyDescription>Your inbox is empty.</EmptyDescription>
    </EmptyHeader>
  </EmptyContent>
</Empty>
```

@prop {string} class - Additional CSS classes
@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="empty"
	class={cn(
		"flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
		className,
	)}
	{...restProps}
>
	{@render children?.()}
</div>
