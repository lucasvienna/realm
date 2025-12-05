<!--
@component
Button that closes the sheet. Use inside `SheetContent`.

@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";

	let { ref = $bindable(null), ...restProps }: SheetPrimitive.CloseProps = $props();
</script>

<SheetPrimitive.Close bind:ref data-slot="sheet-close" {...restProps} />
