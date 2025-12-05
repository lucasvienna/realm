<!--
@component
Title heading for an Alert. Use inside `<Alert>`.

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
	data-slot="alert-title"
	class={cn("col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight", className)}
	{...restProps}
>
	{@render children?.()}
</div>
