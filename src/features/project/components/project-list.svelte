<script>
	import ProjectCard from './project-card.svelte';
</script>

<section class="space-y-20 px-4 py-4 md:px-16 md:py-12 lg:px-24">
	<div>
		<ProjectCard
			project={{
				id: 1,
				name: 'SisBan - Sistem Informasi Seputar Bantuan Sosial',
				description: 'Aplikasi untuk mengelola informasi bantuan sosial pada masyarakat setempat.',
				image: 'https://via.placeholder.com/600x400',
				repository_url: '#',
				live_url: '#',
				tech_stack: ['Svelte', 'TypeScript', 'Tailwind CSS'],
				tags: ['Web', 'Open Source'],
				created_at: '2024-06-01'
			}}
		/>
		<ProjectCard
			project={{
				id: 2,
				name: 'Another Project',
				description: 'This is another project description.',
				image:
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0P7k8DPyLtjrRVCyZsauGzw8lE2fsVJ237A&s',
				repository_url: '#',
				live_url: '#',
				tech_stack: ['SvelteKit', 'JavaScript', 'CSS'],
				tags: ['Mobile', 'Personal'],
				created_at: '2024-05-15'
			}}
		/>
	</div>
</section>
