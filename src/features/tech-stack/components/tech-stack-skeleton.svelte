<script>
	import Skeleton from '@/lib/components/ui/skeleton/skeleton.svelte';
</script>

<div class="flex gap-12">
	{#each Array(6) as _, i}
		<div>
			<Skeleton class="mb-4 h-32 w-32 rounded-md" />
			<Skeleton class="mb-2 h-6 w-3/4 rounded-md" />
			<Skeleton class="h-4 w-1/2 rounded-md" />
		</div>
	{/each}
</div>
