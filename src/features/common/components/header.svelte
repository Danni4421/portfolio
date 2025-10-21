<script lang="ts">
	export let title: string;
	export let description: string;
</script>

<div class="flex flex-col items-center space-y-2">
	<h2 class="font-serif text-3xl font-semibold">{title}</h2>
	<p class="max-w-xl text-center text-base leading-relaxed text-neutral-500">
		{description}
	</p>
</div>
