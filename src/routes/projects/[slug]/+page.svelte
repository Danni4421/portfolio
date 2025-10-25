<script lang="ts">
	import Navbar from '@/lib/components/ui/navbar/navbar.svelte';
	import type { Project } from '@/features/project/types';
	import Markdown from 'svelte-markdown';
	import type { TokensList } from 'marked';
	import PersonBadge from '@/components/person-badge.svelte';
	import { TooltipProvider } from '@/lib/components/ui/tooltip';

	interface PageData {
		project: Project;
		storyMarkdown?: string;
		storyTokens?: TokensList;
	}

	let { data }: { data: PageData } = $props();

	const markdownSource = $derived(data.storyTokens ?? data.storyMarkdown ?? '');
	const markdownOptions = $derived({ gfm: true, breaks: true });
</script>

<svelte:head>
	<title>{data.project.title ?? 'Project'}</title>
	<meta property="og:title" content={data.project.title ?? 'Project'} />
	<meta name="description" content={data.project.description ?? 'Project Overview'} />
	<meta
		property="og:description"
		content={data.project.description ?? "Overview for things that i've made"}
	/>
</svelte:head>

<TooltipProvider
	><main class="grid-pattern min-h-screen px-24 py-20">
		<div class="mx-auto max-w-4xl space-y-8">
			<h1 class="font-serif text-3xl font-bold">{data.project.title}</h1>

			{#if data.project.thumbnail}
				<img
					src={data.project.thumbnail}
					alt={data.project.title}
					class="h-96 w-full rounded-2xl object-cover"
				/>
			{/if}

			{#if data.project.project_teams.length > 0}
				<div class="relative flex flex-wrap justify-end gap-4">
					{#each data.project.project_teams as team (team.name)}
						<PersonBadge name={team.name} is_man={team.is_man} href={team.href ?? undefined} />
					{/each}
				</div>
			{/if}

			{#if data.project.description}
				<div class="flex flex-col">
					<h6 class="text-xl font-bold text-neutral-800">Short Description:</h6>
					<p class="text-lg text-gray-700 dark:text-gray-300">
						{data.project.description}
					</p>
				</div>
			{/if}

			{#if markdownSource}
				<div class="flex flex-col">
					<h6 class="mb-4 text-xl font-bold text-neutral-800">Read the story:</h6>
					<div class="prose dark:prose-invert max-w-none space-y-6">
						<Markdown source={markdownSource} options={markdownOptions} />
					</div>
				</div>
			{/if}
		</div>
	</main>
</TooltipProvider>
