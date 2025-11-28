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
					class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
				>
					<Card.Header>
						<Card.Title class="text-xl leading-tight mb-2">{resource.name}</Card.Title>
						{#if showCategory && resource.category.length > 0}
							<div class="flex flex-wrap gap-1 mb-2">
								{#each resource.category as cat}
									<Badge variant="secondary" class="text-xs">
										{cat}
									</Badge>
								{/each}
							</div>
						{/if}
						{#if resource.description}
							<Card.Description class="line-clamp-3">
								{resource.description}
							</Card.Description>
						{/if}
					</Card.Header>

					<Card.Footer>
						<Button
							href={resource.url}
							target="_blank"
							rel="noopener noreferrer"
							class="w-full group"
							variant="default"
						>
							<ExternalLink class="mr-2 h-4 w-4" />
							Visitar recurso
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
