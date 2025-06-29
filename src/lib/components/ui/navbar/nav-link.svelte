<script lang="ts" module>
	import { cn } from '@/lib/utils';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	export type NavLinkProps = {
		href?: string;
	} & HTMLAnchorAttributes;
</script>

<script lang="ts">
	let { href = '/', class: className, children, ...restProps }: NavLinkProps = $props();
</script>

<a {href} class={cn('rounded px-3 py-1 transition-colors duration-200', className)} {...restProps}>
	{@render children?.()}
</a>
