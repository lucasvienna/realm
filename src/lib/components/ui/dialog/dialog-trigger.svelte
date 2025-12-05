<!--
@component
Button that opens the dialog. Use inside `Dialog`.

@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";

	let { ref = $bindable(null), ...restProps }: DialogPrimitive.TriggerProps = $props();
</script>

<DialogPrimitive.Trigger bind:ref data-slot="dialog-trigger" {...restProps} />
