<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import type { Project } from '../types';
	import { ArrowRight, ExternalLink } from '@lucide/svelte';
	import ProjectLink from './project-link.svelte';

	export let project: Project;
</script>

<div class="group rounded-2xl transition-all duration-300">
	<!-- Project Image -->
	<div
		class="relative aspect-video h-auto max-h-[650px] w-full overflow-hidden rounded-xl bg-gray-100"
	>
		<img
			src={project.thumbnail ?? 'https://via.placeholder.com/600x400'}
			alt={project.title}
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
		/>
		<!-- Overlay Badge -->
		<div class="absolute top-4 right-4 flex gap-2">
			{#each project.tags ?? [] as tag (tag)}
				<span
					class="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900 backdrop-blur"
				>
					{tag}
				</span>
			{/each}
		</div>
	</div>

	<!-- Content -->
	<div class="space-y-4 py-6">
		<h3 class="text-xl font-bold text-gray-900">{project.title}</h3>
		<p class="line-clamp-2 max-w-lg text-sm leading-relaxed text-gray-600">
			{project.description}
		</p>

		<div class="flex gap-3 pt-2">
			{#if project.story}
				<ProjectLink url={`/projects/${project.slug}`} icon={ArrowRight}
					>Read Project Story</ProjectLink
				>
			{/if}

			{#if project.repository_url}
				<ProjectLink url={project.repository_url} icon={ArrowRight}>Source Code</ProjectLink>
			{/if}

			{#if project.live_url}
				<ProjectLink url={project.live_url} icon={ExternalLink}>Live Demo</ProjectLink>
			{/if}
		</div>
	</div>
</div>
