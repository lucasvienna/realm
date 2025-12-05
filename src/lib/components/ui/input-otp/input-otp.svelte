<!--
@component
One-time password/PIN code input with individual character slots.

@example
```svelte
<InputOTP maxlength={6} bind:value={code}>
  <InputOTPGroup>
    <InputOTPSlot {cell} />
  </InputOTPGroup>
</InputOTP>
```

@prop {string} value - Bindable input value
@prop {number} maxlength - Maximum number of characters
@prop {string} class - Additional CSS classes
@prop {HTMLElement} ref - Bindable reference to the underlying element
-->
<script lang="ts">
	import { PinInput as InputOTPPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		...restProps
	}: InputOTPPrimitive.RootProps = $props();
</script>

<InputOTPPrimitive.Root
	bind:ref
	bind:value
	data-slot="input-otp"
	class={cn(
		"flex items-center gap-2 has-disabled:opacity-50 [&_input]:disabled:cursor-not-allowed",
		className,
	)}
	{...restProps}
/>
