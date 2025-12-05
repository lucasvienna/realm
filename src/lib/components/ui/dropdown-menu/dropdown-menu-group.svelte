<!--
@component
Groups related menu items. Use inside `DropdownMenuContent`.

@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let { ref = $bindable(null), ...restProps }: DropdownMenuPrimitive.GroupProps = $props();
</script>

<DropdownMenuPrimitive.Group bind:ref data-slot="dropdown-menu-group" {...restProps} />
