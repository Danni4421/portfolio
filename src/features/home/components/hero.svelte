<script>
	import HeroInfo from './hero-info.svelte';
	import HeroLink from './hero-link.svelte';
</script>

<section class="relative space-y-20 px-4 py-4 md:px-16 md:py-12 lg:px-24">
	<div class="flex flex-col gap-4 md:gap-12">
		<span class="block h-36 w-36 overflow-hidden rounded-lg align-middle md:hidden">
			<img
				src="me.webp"
				alt="It's Me"
				aria-label="Image of Me"
				aria-describedby="This is Me"
				width="80"
				class="h-full w-full object-cover"
			/>
		</span>

		<div class="space-y-8 md:pt-8">
			<h1 class="font-serif text-xl leading-tight font-bold md:text-6xl">
				Crafting clean, fast, and <span class="italic">human-focused</span>
				<span class="ml-3 hidden h-36 w-36 overflow-hidden rounded-lg align-middle md:inline-block">
					<img
						src="me.webp"
						alt="It's Me"
						aria-label="Image of Me"
						aria-describedby="This is Me"
						width="80"
						class="h-full w-full object-cover"
					/>
				</span>
				web experiences (and occasionally debugging why they aren’t).
			</h1>

			<p class="max-w-lg text-base leading-relaxed text-gray-700 md:text-xl">
				I&apos;m Aji - a frontend developer who enjoys turning complex ideas into delightful,
				performant interfaces. Sometimes I go fullstack when the architecture calls for it.
			</p>

			<div class="flex gap-8 pt-2">
				<HeroLink href="#github" label="GitHub" />
				<HeroLink href="#linkedin" label="LinkedIn" />
				<HeroLink href="#email" label="Email" />
			</div>
		</div>

		<HeroInfo />
	</div>
</section>
