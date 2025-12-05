<!--
@component
Title text for a Card. Use inside `CardHeader`.

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
	data-slot="card-title"
	class={cn("leading-none font-semibold", className)}
	{...restProps}
>
	{@render children?.()}
</div>
