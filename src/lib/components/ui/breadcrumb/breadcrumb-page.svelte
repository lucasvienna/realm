<!--
@component
Non-clickable current page indicator. Use inside `BreadcrumbItem` for the final item.

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
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="breadcrumb-page"
	role="link"
	aria-disabled="true"
	aria-current="page"
	class={cn("font-normal text-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</span>
