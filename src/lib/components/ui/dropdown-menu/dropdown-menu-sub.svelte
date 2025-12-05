<!--
@component
Nested submenu container. Use inside `DropdownMenuContent`.

@prop {boolean} open - Bindable open state
-->
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let { open = $bindable(false), ...restProps }: DropdownMenuPrimitive.SubProps = $props();
</script>

<DropdownMenuPrimitive.Sub bind:open {...restProps} />
