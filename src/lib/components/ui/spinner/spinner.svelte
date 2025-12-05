<!--
@component
Animated loading spinner indicator.

@example
```svelte
<Spinner />
<Spinner class="size-8" />
```

@prop {string} class - Additional CSS classes (use size-* to change dimensions)
-->
<script lang="ts">
	import { cn } from "$lib/utils.js";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";
	import type { ComponentProps } from "svelte";

	let { class: className, ...restProps }: ComponentProps<typeof Loader2Icon> = $props();
</script>

<Loader2Icon
	role="status"
	aria-label="Loading"
	class={cn("size-4 animate-spin", className)}
	{...restProps}
/>
