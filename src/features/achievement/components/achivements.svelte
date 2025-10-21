<script lang="ts">
	import Header from '@/features/common/components/header.svelte';
	import type { Achievement } from '../types';
	import AchievementCard from './achievement-card.svelte';

	export let achievements: Array<Achievement>;
</script>

<section class="space-y-20 px-4 py-4 md:px-16 md:py-12 lg:px-24">
	<div class="space-y-12">
		<Header
			title="Achievements"
			description="Milestones that showcase my dedication to delivering exceptional design and creating meaningful impact."
		/>

		<div class="grid grid-cols-1 gap-8">
			{#each achievements as achievement}
				<AchievementCard {achievement} />
			{/each}
		</div>
	</div>
</section>
