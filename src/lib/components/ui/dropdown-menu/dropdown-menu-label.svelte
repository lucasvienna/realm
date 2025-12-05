<!--
@component
Non-interactive label text. Use inside `DropdownMenuContent`.

@prop {boolean} inset - Add left padding to align with checkbox/radio items
@prop {string} class - Additional CSS classes
@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		inset,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		inset?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="dropdown-menu-label"
	data-inset={inset}
	class={cn("px-2 py-1.5 text-sm font-semibold data-[inset]:ps-8", className)}
	{...restProps}
>
	{@render children?.()}
</div>
