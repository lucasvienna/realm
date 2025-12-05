<!--
@component
Container for a navigation menu item. Use inside `NavigationMenuList`.

@prop {string} class - Additional CSS classes
@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.ItemProps = $props();
</script>

<NavigationMenuPrimitive.Item
	bind:ref
	data-slot="navigation-menu-item"
	class={cn("relative", className)}
	{...restProps}
/>
