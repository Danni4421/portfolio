<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let url: string = '#';
	export let icon: any = null;
</script>

<a
	href={url}
	target="_blank"
	rel="noopener noreferrer"
	class="flex items-center gap-2 text-sm font-medium text-gray-900 transition-colors hover:text-green-700"
>
	<slot />
	{#if icon}
		<svelte:component this={icon} size={16} />
	{/if}
</a>
