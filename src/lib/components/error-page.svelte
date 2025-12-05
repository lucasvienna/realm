<script lang="ts">
	import type { Snippet } from "svelte";
	import { twMerge } from "tailwind-merge";

	interface Props {
		title: Snippet;
		paragraph: Snippet;
		titleClass?: string;
		paragraphClass?: string;
	}

	let { title, paragraph, titleClass, paragraphClass }: Props = $props();

	let pCls = () => twMerge("", paragraphClass);
	let h1Cls = () =>
		twMerge(
			"mb-4 text-7xl tracking-tight font-bold lg:text-9xl text-primary-600 dark:text-primary-500",
			titleClass,
		);
</script>

<main class="mx-auto max-w-screen text-center">
	<h1 class={h1Cls()}>{@render title()}</h1>
	<section class={pCls()}>{@render paragraph()}</section>
</main>

<!--
@component
## Props
@props {Snippet} title
@props {Snippet} paragraph
@props {string?} titleClass
@props {string?} paragraphClass
-->
