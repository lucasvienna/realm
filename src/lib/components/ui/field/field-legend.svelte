<!--
@component
Legend element for fieldsets. Use inside `FieldSet`.

@prop {"legend" | "label"} variant - Size variant (default: "legend")
@prop {string} class - Additional CSS classes
@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "legend",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLLegendElement>> & {
		variant?: "legend" | "label";
	} = $props();
</script>

<legend
	bind:this={ref}
	data-slot="field-legend"
	data-variant={variant}
	class={cn(
		"mb-3 font-medium",
		"data-[variant=legend]:text-base",
		"data-[variant=label]:text-sm",
		className,
	)}
	{...restProps}
>
	{@render children?.()}
</legend>
