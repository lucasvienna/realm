<!--
@component
Header container for title and description. Use inside `EmptyContent`.

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
	data-slot="empty-header"
	class={cn("flex max-w-sm flex-col items-center gap-2 text-center", className)}
	{...restProps}
>
	{@render children?.()}
</div>
