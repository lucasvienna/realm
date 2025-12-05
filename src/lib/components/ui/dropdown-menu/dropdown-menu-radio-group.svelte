<!--
@component
Groups radio items for single selection. Use inside `DropdownMenuContent`.

@prop {string} value - Bindable selected value
@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		value = $bindable(),
		...restProps
	}: DropdownMenuPrimitive.RadioGroupProps = $props();
</script>

<DropdownMenuPrimitive.RadioGroup
	bind:ref
	bind:value
	data-slot="dropdown-menu-radio-group"
	{...restProps}
/>
