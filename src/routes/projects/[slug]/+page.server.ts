import { getProjectBySlug } from '@/features/project/services/project';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';

marked.setOptions({
	breaks: true,
	gfm: true,
	pedantic: false
});
export const load: PageServerLoad = async ({ params }) => {
	try {
		const { project } = await getProjectBySlug(params.slug);

		if (!project) {
			throw error(404, 'Project not found');
		}

		let storyHtml = '';
		if (project.story) {
			try {
				const response = await fetch(project.story);
				if (!response.ok) throw new Error('Failed to fetch story');

				const markdownText = await response.text();
				storyHtml = await marked(markdownText);
			} catch (fetchErr) {
				console.error('Error fetching markdown:', fetchErr);
			}
		}

		return {
			project,
			storyHtml
		};
	} catch (err) {
		console.error('Error loading project:', err);
		throw error(500, 'Failed to load project');
	}
};
