<script lang="ts">
	import type { Achievement } from '../types';

	export let achievement: Achievement;
</script>

<div
	class="flex cursor-pointer justify-between rounded-2xl border border-gray-200 bg-white p-8 transition hover:shadow-sm"
>
	<div class="flex flex-col justify-between">
		<div class="space-y-4">
			<p class="text-3xl font-semibold text-gray-900">
				{achievement.title}
			</p>
			<p class="text-md leading-relaxed text-gray-600">
				{achievement.description}
			</p>
		</div>

		<a
			href={`/achievement/${achievement.id}`}
			target="_blank"
			rel="noopener noreferrer"
			class="mt-6 inline-block"
		>
			<p class="mt-4 text-sm font-medium text-blue-600 hover:underline">View more &rarr;</p>
		</a>
	</div>

	<div class="h-48 w-80 overflow-hidden rounded-lg object-cover">
		<img src={achievement.thumbnailUrl} alt={achievement.id} class="h-full w-full" />
	</div>
</div>
