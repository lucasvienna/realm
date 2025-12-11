<script lang="ts">
	import type { Component } from "svelte";
	import type { IconProps } from "@lucide/svelte";

	interface Props {
		name: string;
		icon: Component<IconProps>;
		current: number;
		cap: number;
		production: number;
		accumulator: number;
		accumulatorCap: number;
		color: "amber" | "emerald" | "slate" | "yellow";
	}

	let {
		name,
		icon: Icon,
		current,
		cap,
		production,
		accumulator,
		accumulatorCap,
		color,
	}: Props = $props();

	const percentage = $derived(cap > 0 ? Math.min(100, (current / cap) * 100) : 0);

	const barColorClass = $derived.by(() => {
		if (percentage >= 100) return "bg-red-500";
		if (percentage >= 90) return "bg-orange-500";

		switch (color) {
			case "amber":
				return "bg-amber-500";
			case "emerald":
				return "bg-emerald-600";
			case "slate":
				return "bg-slate-500";
			case "yellow":
				return "bg-yellow-500";
		}
	});

	const iconColorClass = $derived.by(() => {
		switch (color) {
			case "amber":
				return "text-amber-500";
			case "emerald":
				return "text-emerald-600";
			case "slate":
				return "text-slate-500";
			case "yellow":
				return "text-yellow-500";
		}
	});

	const trackColorClass = $derived.by(() => {
		switch (color) {
			case "amber":
				return "bg-amber-500/20";
			case "emerald":
				return "bg-emerald-600/20";
			case "slate":
				return "bg-slate-500/20";
			case "yellow":
				return "bg-yellow-500/20";
		}
	});
</script>

<div class="space-y-2">
	<!-- Icon and Name -->
	<div class="flex items-center gap-2">
		<Icon class="size-5 {iconColorClass}" />
		<span class="text-sm font-medium">{name}</span>
	</div>

	<!-- Current / Cap -->
	<div class="flex items-baseline gap-1">
		<span class="text-2xl font-semibold">{current}</span>
		<span class="text-sm text-muted-foreground">/ {cap}</span>
	</div>

	<!-- Progress Bar -->
	<div class="relative h-2 w-full overflow-hidden rounded-full {trackColorClass}">
		<div
			class="h-full transition-all duration-300 {barColorClass}"
			style="width: {percentage}%"
		></div>
	</div>

	<!-- Production Rate -->
	<div class="space-y-0.5">
		<p class="text-sm text-muted-foreground">
			<span class="font-medium text-foreground">+{production}</span> /cycle
		</p>
		<p class="text-xs text-muted-foreground">acc {accumulator}/{accumulatorCap}</p>
	</div>
</div>
