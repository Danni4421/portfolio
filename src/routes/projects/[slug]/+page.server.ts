import { getProjectBySlug } from '@/features/project/services/project';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import type { TokensList } from 'marked';
import type { PageServerLoad } from './$types';
const stripFrontmatter = (raw: string) => raw.replace(/^---\s*[\s\S]*?---\s*/u, '').trimStart();

const ensureCommonmarkSpacing = (markdown: string) =>
	markdown
		.replace(/^(\s{0,3})(#{1,6})([^\s#])/gm, '$1$2 $3')
		.replace(/^(\s{0,3})>([^\s>])/gm, '$1> $2');

const withAbsoluteAssetUrls = (markdown: string, source?: string) => {
	if (!source) return markdown;

	try {
		const base = new URL('.', source).href;
		return markdown.replace(
			/(!?\[[^\]]*\]\()(?!(?:[a-z]+:\/\/|\/|#))([^)\s]+)([^)]*)\)/gi,
			(_m, prefix, link, suffix) => `${prefix}${base}${link}${suffix})`
		);
	} catch {
		return markdown;
	}
};

export const load: PageServerLoad = async ({ params }) => {
	try {
		const { project } = await getProjectBySlug(params.slug);

		if (!project) {
			throw error(404, 'Project not found');
		}

		let storyMarkdown = '';
		let storyTokens: TokensList | undefined;
		if (project.story) {
			try {
				const response = await fetch(project.story);
				if (!response.ok) throw new Error('Failed to fetch story');

				const markdownText = await response.text();
				const normalized = stripFrontmatter(markdownText.replace(/\r\n/g, '\n'));
				const spaced = ensureCommonmarkSpacing(normalized);
				storyMarkdown = withAbsoluteAssetUrls(spaced, project.story);
				storyTokens = marked.lexer(storyMarkdown, { gfm: true, breaks: true });
			} catch (fetchErr) {
				console.error('Error fetching markdown:', fetchErr);
			}
		}

		return {
			project,
			storyMarkdown,
			storyTokens
		};
	} catch (err) {
		console.error('Error loading project:', err);
		throw error(500, 'Failed to load project');
	}
};
