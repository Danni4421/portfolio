<script lang="ts">
	import Navbar from '@/lib/components/ui/navbar/navbar.svelte';
	import type { Project } from '@/features/project/types';
	import Markdown from 'svelte-markdown';
	import type { TokensList } from 'marked';

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

<main class="grid-pattern min-h-screen">
	<Navbar />

	<section class="px-24 py-20">
		<div class="mx-auto max-w-4xl space-y-8">
			<h1 class="font-serif text-3xl font-bold">{data.project.title}</h1>

			{#if data.project.thumbnail}
				<img
					src={data.project.thumbnail}
					alt={data.project.title}
					class="h-96 w-full rounded-2xl object-cover"
				/>
			{/if}

			{#if markdownSource}
				<Markdown
					class="prose dark:prose-invert max-w-none"
					source={markdownSource}
					options={markdownOptions}
				/>
			{/if}
		</div>
	</section>
</main>
