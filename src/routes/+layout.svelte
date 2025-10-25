<script lang="ts">
	import Navbar from '@/lib/components/ui/navbar/navbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<main class="">
	<Navbar />

	{#if children}
		<div class="mt-20">{@render children()}</div>
	{/if}
</main>
