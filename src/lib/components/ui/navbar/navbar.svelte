<script lang="ts">
	import Button from '../button/button.svelte';
	import NavBrand from './nav-brand.svelte';
	import NavLink from './nav-link.svelte';
	import { Menu } from '@lucide/svelte';

	let showMobileNav = false;
</script>

<nav
	class="flex items-center justify-between border-b-[0.5px] border-neutral-200 px-8 py-3 text-neutral-800 dark:border-neutral-700 dark:bg-zinc-900 dark:text-neutral-200"
>
	<NavBrand alt="Aji Hamdani Ahmad" brandName="Aji" />

	<ul class="m-0 hidden list-none gap-6 p-0 md:flex">
		<li class="flex items-center">
			<NavLink
				href="/"
				class="border-b-2 border-transparent font-medium transition-colors duration-200 hover:border-sky-400 hover:text-gray-800"
			>
				Home
			</NavLink>
		</li>
		<li class="flex items-center">
			<NavLink
				href="/"
				class="border-b-2 border-transparent font-medium transition-colors duration-200 hover:border-sky-400 hover:text-gray-800"
			>
				Services
			</NavLink>
		</li>
		<li class="flex items-center">
			<NavLink
				href="/"
				class="border-b-2 border-transparent font-medium transition-colors duration-200 hover:border-sky-400 hover:text-gray-800"
			>
				Projects
			</NavLink>
		</li>
	</ul>

	<Button variant="default" class="hidden cursor-pointer transition-opacity md:flex"
		>Hire Me 😁</Button
	>

	<div class="flex items-center md:hidden">
		<button on:click={() => (showMobileNav = !showMobileNav)} aria-label="Toggle navigation">
			<Menu size={16} />
		</button>
	</div>

	{#if showMobileNav}
		<ul
			class="absolute top-14 left-0 z-50 flex w-full flex-col gap-4 border-b border-neutral-200 bg-white p-4 md:hidden dark:border-neutral-700 dark:bg-zinc-900"
		>
			<li>
				<NavLink href="/" class="font-medium transition-colors hover:text-sky-400">Home</NavLink>
			</li>
		</ul>
	{/if}
</nav>
