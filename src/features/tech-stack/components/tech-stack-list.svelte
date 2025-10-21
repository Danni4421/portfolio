<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '@/features/common/components/header.svelte';
	import { getTechStacks } from '../services/tech-stack';
	import TechStackCard from './tech-stack-card.svelte';
	import type { TechStack } from '../types';
	import TechStackSkeletonList from './tech-stack-skeleton.svelte';

	let techStacks: TechStack[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const { stacks } = await getTechStacks();
			techStacks = stacks;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load tech stacks';
			console.error(error);
		} finally {
			loading = false;
		}
	});

	$: stacks = [...techStacks, ...techStacks, ...techStacks].map((tech, i) => ({
		...tech,
		uniqueId: `${tech.id}-${i}`
	}));
</script>

<section class="space-y-12 overflow-hidden py-12">
	<Header
		title="Tech Stack?"
		description="The slide show below showcases my tech stack, It's not a lot but I'm constantly learning and improving."
	/>

	{#if loading}
		<div class="flex justify-center py-8">
			<TechStackSkeletonList />
		</div>
	{:else if error}
		<div class="flex justify-center py-8">
			<p class="text-red-500">Error: {error}</p>
		</div>
	{:else if stacks.length > 0}
		<div class="animate-scroll flex gap-16">
			{#each stacks as tech (tech.uniqueId)}
				<TechStackCard stack={tech} />
			{/each}
		</div>
	{:else}
		<div class="flex justify-center py-8">
			<p class="text-gray-500">No tech stacks available</p>
		</div>
	{/if}
</section>

<style>
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-33.33% * 2));
		}
	}

	:global(.animate-scroll) {
		animation: scroll 30s linear infinite;
		will-change: transform;
		display: flex;
	}

	:global(.animate-scroll:hover) {
		animation-play-state: paused;
	}
</style>
