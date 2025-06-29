<script>
	import Navbar from '@/lib/components/ui/navbar/navbar.svelte';
</script>

<svelte:head>
	<title>Me</title>
	<meta name="description" content="Overview for things that i've made" />
	<meta property="og:title" content="Me" />
	<meta property="og:description" content="Overview for things that i've made" />
</svelte:head>

<main>
	<Navbar />

	<section class="px-24 py-8">
		<div class="h-[300px] w-[300px] overflow-hidden rounded-2xl">
			<img
				src="me.webp"
				alt="It's Me"
				aria-label="Image of Me"
				aria-describedby="This is Me"
				width="300"
			/>
		</div>
	</section>
</main>
