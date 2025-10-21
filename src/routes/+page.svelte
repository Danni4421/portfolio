<script>
	import Navbar from '@/lib/components/ui/navbar/navbar.svelte';
	import Hero from '@/features/home/components/hero.svelte';
	import Achievements from '@/features/achievement/components/achivements.svelte';

	import { achievements } from '@/features/achievement/constants';
	import TechStackList from '@/features/tech-stack/components/tech-stack-list.svelte';
</script>

<svelte:head>
	<title>Me</title>
	<meta name="description" content="Overview for things that i've made" />
	<meta property="og:title" content="Me" />
	<meta property="og:description" content="Overview for things that i've made" />
</svelte:head>

<main class="grid-pattern min-h-screen">
	<Navbar />
	<div class="mt-20">
		<Hero />
		<TechStackList />
		<Achievements {achievements} />
	</div>
</main>
