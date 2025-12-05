<!--
@component
Root component for dropdown menus. Controls open state.

@example
```svelte
<DropdownMenu>
  <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Action 1</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Action 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

@prop {boolean} open - Bindable open state
-->
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let { open = $bindable(false), ...restProps }: DropdownMenuPrimitive.RootProps = $props();
</script>

<DropdownMenuPrimitive.Root bind:open {...restProps} />
