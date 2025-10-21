<script lang="ts">
	import type { TechStack } from '../types';

	export let stack: TechStack;
</script>

<div class="flex min-w-24 flex-col items-center">
	<img
		src={stack.icon_url ?? 'https://via.placeholder.com/150'}
		alt="{stack.name} icon"
		class="mb-4 h-12 w-auto object-contain grayscale transition duration-300 hover:grayscale-0"
	/>
	<h3 class="mb-2 text-center text-lg font-semibold">{stack.name}</h3>
</div>
