<script lang="ts">
	import Header from '@/features/common/components/header.svelte';
	import { techStacks } from '../constants';
	import TechStackCard from './tech-stack-card.svelte';

	const stacks = [...techStacks, ...techStacks, ...techStacks].map((tech, i) => ({
		...tech,
		uniqueId: `${tech.id}-${i}`
	}));
</script>

<section class="space-y-12 overflow-hidden py-12">
	<Header
		title="Tech Stack?"
		description="The slide show below showcases my tech stack, It's not a lot but I'm constantly learning and improving."
	/>

	<div class="animate-scroll flex gap-16">
		{#each stacks as tech (tech.uniqueId)}
			<TechStackCard stack={tech} />
		{/each}
	</div>
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
		animation: scroll 40s linear infinite;
		will-change: transform;
		display: flex;
	}

	:global(.animate-scroll:hover) {
		animation-play-state: paused;
	}
</style>
