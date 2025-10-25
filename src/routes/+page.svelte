<script>
	import Navbar from '@/lib/components/ui/navbar/navbar.svelte';
	import Hero from '@/features/home/components/hero.svelte';
	import TechStackList from '@/features/tech-stack/components/tech-stack-list.svelte';
	import Achievements from '@/features/achievement/components/achivements.svelte';
	import ContactMe from '@/features/contact/components/contact-me.svelte';
	import ProjectList from '@/features/project/components/project-list.svelte';
</script>

<svelte:head>
	<title>Me</title>
	<meta name="description" content="Overview for things that i've made" />
	<meta property="og:title" content="Me" />
	<meta property="og:description" content="Overview for things that i've made" />
</svelte:head>

<main class="grid-pattern min-h-screen">
	<Hero />
	<TechStackList />
	<ProjectList />
	<Achievements />
	<ContactMe />
</main>
