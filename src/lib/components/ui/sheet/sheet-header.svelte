<!--
@component
Header container for sheet title and description. Use inside `SheetContent`.

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
	data-slot="sheet-header"
	class={cn("flex flex-col gap-1.5 p-4", className)}
	{...restProps}
>
	{@render children?.()}
</div>
