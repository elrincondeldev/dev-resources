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
	<div class="container mx-auto px-4 max-w-7xl py-8">
		<!-- Hero Section -->
		<div class="text-center mb-8">
			<h1 class="text-3xl md:text-4xl font-bold mb-2">Recursos curados para desarrolladores</h1>
			<p class="text-muted-foreground text-sm md:text-base">
				Aprende, practica y mejora tus habilidades de programación
			</p>
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
		<div class="flex flex-col xl:flex-row gap-8">
			<div class="flex-1 order-2 xl:order-1">
				{#if selectedCategory === 'all'}
					<ResourcesList />
				{:else}
					<ResourcesList category={selectedCategory} />
				{/if}
			</div>
			<div class="order-1 xl:order-2 xl:sticky xl:top-24 xl:self-start">
				<div class="w-full md:max-w-[480px] mx-auto xl:mx-0">
					<iframe
						src="https://elrincondeldev.substack.com/embed"
						class="w-full h-[320px] rounded-lg shadow-sm"
						style="border:1px solid #EEE; background:white;"
						frameborder="0"
						scrolling="no"
						title="Newsletter de El Rincón del Dev"
					></iframe>
				</div>
			</div>
		</div>
	</div>
</div>
