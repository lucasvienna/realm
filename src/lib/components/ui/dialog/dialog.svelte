<!--
@component
Modal dialog root. Controls open state and contains all dialog parts.

@example
```svelte
<Dialog bind:open>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

@prop {boolean} open - Bindable open state
-->
<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";

	let { open = $bindable(false), ...restProps }: DialogPrimitive.RootProps = $props();
</script>

<DialogPrimitive.Root bind:open {...restProps} />
