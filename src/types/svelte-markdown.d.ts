import type { SvelteComponentTyped } from 'svelte';
import type { MarkedOptions, TokensList } from 'marked';

declare module 'svelte-markdown' {
	interface MarkdownProps {
		source?: string | TokensList;
		renderers?: Record<
			string,
			new (...args: unknown[]) => SvelteComponentTyped<Record<string, unknown>>
		>;
		options?: MarkedOptions;
		isInline?: boolean;
	}

	export default class Markdown extends SvelteComponentTyped<
		MarkdownProps,
		{ parsed: CustomEvent<{ tokens: TokensList }> },
		{ default: Record<string, unknown> }
	> {}
}
