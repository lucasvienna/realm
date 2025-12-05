<!--
@component
Root navigation menu with dropdown support. Includes viewport by default.

@example
```svelte
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/products">View All</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

@prop {boolean} viewport - Show the viewport container (default: true)
@prop {string} class - Additional CSS classes
@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import NavigationMenuViewport from "./navigation-menu-viewport.svelte";

	let {
		ref = $bindable(null),
		class: className,
		viewport = true,
		children,
		...restProps
	}: NavigationMenuPrimitive.RootProps & {
		viewport?: boolean;
	} = $props();
</script>

<NavigationMenuPrimitive.Root
	bind:ref
	data-slot="navigation-menu"
	data-viewport={viewport}
	class={cn(
		"group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
		className,
	)}
	{...restProps}
>
	{@render children?.()}

	{#if viewport}
		<NavigationMenuViewport />
	{/if}
</NavigationMenuPrimitive.Root>
