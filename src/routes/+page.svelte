<script lang="ts">
	import ResourcesList from '$lib/components/ResourcesList.svelte';
	import { Button } from '$lib/components/ui/button';

	const categories = [
		'Full Stack',
		'Backend',
		'Practice',
		'Roadmaps',
		'Typescript',
		'Programming',
		'Logic',
		'Git',
		'CSS',
		'Computer Science',
		'Design Patterns',
		'JavaScript',
		'SQL',
		'System Design',
		'Books'
	];

	let selectedCategory = $state<string>('all');
</script>

<div class="min-h-screen bg-linear-to-br from-background to-muted/20">
	<div class="container mx-auto px-4max-w-7xl">
		<!-- Hero Section -->
		<div class="text-center p-12">
			<h1 class="bg-linear-to-r from-indigo-800 to-indigo-600 inline-block text-transparent bg-clip-text text-[4rem] font-bold">
                Dev Resources
			</h1>
		</div>

		<!-- Category Filter -->
		<div class="flex flex-wrap gap-3 justify-center mb-10">
			<Button
				variant={selectedCategory === 'all' ? 'default' : 'outline'}
				size="lg"
				onclick={() => (selectedCategory = 'all')}
				class="transition-all"
			>
				Todos
			</Button>
			{#each categories as category}
				<Button
					variant={selectedCategory === category ? 'default' : 'outline'}
					size="lg"
					onclick={() => (selectedCategory = category)}
					class="transition-all"
				>
					{category}
				</Button>
			{/each}
		</div>

		<!-- Resources Section -->
		<div class="mt-8">
			{#if selectedCategory === 'all'}
				<ResourcesList />
			{:else}
				<ResourcesList category={selectedCategory} />
			{/if}
		</div>
	</div>
</div>
