<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectCard from './project-card.svelte';
	import Header from '@/features/common/components/header.svelte';
	import { getRecentProjects } from '../services/project';
	import type { Project } from '../types';

	let projects: Array<Project> = [];

	onMount(async () => {
		const { projects: fetchedProjects } = await getRecentProjects();
		projects = fetchedProjects;
	});
</script>

<section class="space-y-20 px-4 py-4 md:px-16 md:py-12 lg:px-24">
	<div>
		<Header title="Recent Projects" description="A selection of my latest work and projects." />
	</div>
	<div class="flex flex-col gap-8">
		{#each projects as project (project.id)}
			<ProjectCard {project} />
		{/each}
	</div>
</section>
