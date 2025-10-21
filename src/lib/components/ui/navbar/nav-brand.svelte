<script lang="ts" module>
	import { cn } from '@/lib/utils';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	export type NavBrandProps = {
		href?: string;
		logoSrc?: string | null;
		alt?: string;
		brandName?: string;
	} & HTMLAnchorAttributes;
</script>

<script lang="ts">
	let {
		href = '/',
		logoSrc = null,
		alt = 'Brand Logo',
		brandName = 'Brand Name',
		...restProps
	}: NavBrandProps = $props();
</script>

<a
	{href}
	class={cn(
		'flex items-center gap-2 text-xl font-medium text-inherit no-underline',
		restProps.class
	)}
	{...restProps}
	aria-label={brandName}
>
	{#if logoSrc}
		<img src={logoSrc} {alt} class="h-8 w-8 object-contain" />
	{/if}
	<span class="tracking-wider">{brandName}</span>
</a>
