<script lang="ts">
	import { Github, Star, Plus } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import ProposeResourceModal from '$lib/components/ProposeResourceModal.svelte';

	const GITHUB_REPO = 'elrincondeldev/dev-resources';
	let starCount = $state<number | null>(null);
	let showProposeModal = $state(false);

	onMount(async () => {
		try {
			const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`);
			if (response.ok) {
				const data = await response.json();
				starCount = data.stargazers_count;
			}
		} catch (error) {
			console.error('Error fetching GitHub stars:', error);
		}
	});
</script>

<header
	class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
>
	<div class="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
		<!-- Logo / Título -->
		<div class="flex items-center gap-2">
			<a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
				<span
					class="text-2xl font-bold bg-linear-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent"
				>
					El Rincón Del Dev
				</span>
			</a>
		</div>

		<!-- Navegación y GitHub Star -->
		<nav class="flex items-center gap-3">
			<!-- Proponer Recurso Button -->
			<Button onclick={() => (showProposeModal = true)} size="sm" class="hidden sm:flex gap-2">
				<Plus class="h-4 w-4" />
				Proponer recurso
			</Button>

			<!-- Mobile: Solo icono -->
			<Button onclick={() => (showProposeModal = true)} size="icon" class="sm:hidden">
				<Plus class="h-4 w-4" />
			</Button>

			<!-- GitHub Star Button -->
			<a
				href="https://github.com/{GITHUB_REPO}"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all group"
			>
				<Github class="h-4 w-4 group-hover:scale-110 transition-transform" />
				<span class="hidden sm:inline text-sm font-medium">Star</span>
				<div class="flex items-center gap-1">
					<Star
						class="h-4 w-4 group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-all"
					/>
					{#if starCount !== null}
						<span class="text-xs font-semibold">{starCount}</span>
					{/if}
				</div>
			</a>
		</nav>
	</div>
</header>

<!-- Modal para proponer recursos -->
<ProposeResourceModal bind:show={showProposeModal} onClose={() => (showProposeModal = false)} />
