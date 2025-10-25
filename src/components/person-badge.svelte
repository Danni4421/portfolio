<script lang="ts">
	import { Tooltip } from '@/lib/components/ui/tooltip';
	import TooltipContent from '@/lib/components/ui/tooltip/tooltip-content.svelte';
	import TooltipTrigger from '@/lib/components/ui/tooltip/tooltip-trigger.svelte';

	export let name: string;
	export let is_man: boolean;
	export let href: string | null = null;
</script>

<Tooltip>
	<TooltipTrigger>
		{#if href}
			<a
				{href}
				target="_blank"
				rel="noopener noreferrer"
				class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white p-2 transition-shadow hover:shadow-md"
			>
				{#if is_man}
					<img src="/port-man.png" alt={name} />
				{:else}
					<img src="/port-woman.png" alt={name} />
				{/if}
			</a>
		{:else}
			<div
				class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white p-2"
			>
				{#if is_man}
					<img src="/port-man.png" alt={name} />
				{:else}
					<img src="/port-woman.png" alt={name} />
				{/if}
			</div>
		{/if}
	</TooltipTrigger>
	<TooltipContent side="bottom">{name}</TooltipContent>
</Tooltip>
