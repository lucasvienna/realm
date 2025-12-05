<!--
@component
Slide-out panel from screen edge. Similar to Dialog but slides in from a side.

@example
```svelte
<Sheet bind:open>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Adjust your preferences.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

@prop {boolean} open - Bindable open state
-->
<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";

	let { open = $bindable(false), ...restProps }: SheetPrimitive.RootProps = $props();
</script>

<SheetPrimitive.Root bind:open {...restProps} />
