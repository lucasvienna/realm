<!--
@component
Groups checkbox items for multi-select. Use inside `DropdownMenuContent`.

@prop {string[]} value - Bindable array of selected values
@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		value = $bindable([]),
		...restProps
	}: DropdownMenuPrimitive.CheckboxGroupProps = $props();
</script>

<DropdownMenuPrimitive.CheckboxGroup
	bind:ref
	bind:value
	data-slot="dropdown-menu-checkbox-group"
	{...restProps}
/>
