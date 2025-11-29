<script lang="ts">
	import { resourcesApi } from '$lib/services/resources';
	import type { Resource } from '$lib/types/database.types';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { ExternalLink, Loader2 } from '@lucide/svelte';

	interface Props {
		category?: string;
		limit?: number;
		showCategory?: boolean;
	}

	let { category, limit, showCategory = true }: Props = $props();

	let resources = $state<Resource[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	$effect(() => {
		loadResources();
	});

	async function loadResources() {
		loading = true;
		error = null;

		try {
			let result;

			if (category) {
				result = await resourcesApi.getByCategory(category, true);
			} else {
				result = await resourcesApi.getActive();
			}

			if (result.error) {
				throw new Error(result.error.message);
			}

			resources = limit ? (result.data ?? []).slice(0, limit) : (result.data ?? []);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error cargando recursos';
		} finally {
			loading = false;
		}
	}
</script>

<div class="w-full">
	{#if loading}
		<div class="flex flex-col items-center justify-center py-16 text-muted-foreground">
			<Loader2 class="h-10 w-10 animate-spin mb-4" />
			<p>Cargando recursos...</p>
		</div>
	{:else if error}
		<div
			class="flex flex-col items-center justify-center gap-4 py-8 px-4 bg-destructive/10 rounded-lg border border-destructive/20"
		>
			<p class="text-destructive font-semibold">❌ {error}</p>
			<Button onclick={loadResources} variant="destructive">Reintentar</Button>
		</div>
	{:else if resources.length === 0}
		<div class="text-center py-16">
			<p class="text-4xl mb-4">📦</p>
			<p class="text-muted-foreground">No hay recursos disponibles</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each resources as resource (resource.id)}
				<Card.Root
					class="group relative overflow-hidden border border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 ease-out hover:-translate-y-2 flex flex-col justify-between before:absolute before:inset-0 before:bg-linear-to-br before:from-primary/5 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
				>
					<!-- Accent bar superior -->
					<div
						class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary/60 via-primary to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
					></div>

					<Card.Header class="relative z-10 pb-4">
						<Card.Title
							class="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors duration-300"
						>
							{resource.name}
						</Card.Title>
						{#if showCategory && resource.category.length > 0}
							<div class="flex flex-wrap gap-2 mb-3">
								{#each resource.category as cat}
									<Badge
										variant="secondary"
										class="text-xs px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 transition-colors duration-300"
									>
										{cat}
									</Badge>
								{/each}
							</div>
						{/if}
						{#if resource.description}
							<Card.Description class="line-clamp-3 text-sm leading-relaxed">
								{resource.description}
							</Card.Description>
						{/if}
					</Card.Header>

					<Card.Footer class="relative z-10 pt-4">
						<Button
							href={resource.url}
							target="_blank"
							rel="noopener noreferrer"
							class="w-full group/btn relative overflow-hidden bg-linear-to-r from-primary to-primary/90 hover:from-primary hover:to-primary shadow-md hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
							variant="default"
						>
							<span class="relative z-10 flex items-center justify-center">
								<ExternalLink
									class="mr-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform duration-300"
								/>
								Visitar recurso
							</span>
							<div
								class="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/group-hover/btn:translate-x-full transition-transform duration-700"
							></div>
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
