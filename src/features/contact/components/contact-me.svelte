<script lang="ts">
	import { Input } from '@/lib/components/ui/input';
	import { Button } from '@/lib/components/ui/button';
	import { Textarea } from '@/lib/components/ui/textarea';
	import { Label } from '@/lib/components/ui/label';

	let email = '';
	let message = '';
	let loading = false;
	let success = false;
	let error = '';

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		error = '';
		success = false;

		try {
			const response = await fetch('https://formspree.io/f/mnngywja', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, message })
			});

			if (!response.ok) throw new Error('Failed to send message');

			success = true;
			email = '';
			message = '';
			setTimeout(() => (success = false), 5000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Something went wrong';
			setTimeout(() => (error = ''), 5000);
		} finally {
			loading = false;
		}
	}
</script>

<section class="relative space-y-20 px-4 py-4 md:px-16 md:py-12 lg:px-24">
	<div class="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8">
		<!-- Header -->
		<div class="mb-12 space-y-2">
			<p class="text-sm font-medium text-gray-600">Get in touch with me</p>
			<h2 class="font-serif text-3xl font-bold">Contact Me</h2>
		</div>

		<form on:submit={handleSubmit} class="space-y-6">
			<!-- Email Input -->
			<div class="space-y-2">
				<Label for="email">Email Address</Label>
				<Input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					required
					placeholder="your@email.com"
				/>
			</div>

			<!-- Message Textarea -->
			<div class="space-y-2">
				<Label for="message">Message</Label>
				<Textarea
					id="message"
					name="message"
					bind:value={message}
					required
					rows={6}
					placeholder="Tell me about your thoughts..."
				/>
			</div>

			<!-- Success Message -->
			{#if success}
				<div class="rounded-lg border border-green-200 bg-green-50 p-4">
					<p class="text-sm font-medium text-green-800">
						✓ Message sent successfully! I'll get back to you soon.
					</p>
				</div>
			{/if}

			<!-- Error Message -->
			{#if error}
				<div class="rounded-lg border border-red-200 bg-red-50 p-4">
					<p class="text-sm font-medium text-red-800">
						✗ Error: {error}
					</p>
				</div>
			{/if}

			<!-- Submit Button -->
			<Button type="submit" disabled={loading} class="w-full" variant="default">
				{loading ? 'Sending...' : 'Send Message'}
			</Button>
		</form>
	</div>
</section>
