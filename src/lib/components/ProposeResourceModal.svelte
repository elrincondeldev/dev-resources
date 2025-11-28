<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Badge } from '$lib/components/ui/badge';
	import * as Alert from '$lib/components/ui/alert';
	import { X, Check, AlertCircle, Loader2, Plus } from 'lucide-svelte';
	import { resourcesApi } from '$lib/services/resources';

	interface Props {
		show: boolean;
		onClose: () => void;
	}

	let { show = $bindable(), onClose }: Props = $props();

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

	let formData = $state({
		name: '',
		description: '',
		url: '',
		category: [] as string[]
	});

	let loading = $state(false);
	let success = $state(false);
	let error = $state<string | null>(null);

	function toggleCategory(cat: string) {
		if (formData.category.includes(cat)) {
			formData.category = formData.category.filter((c) => c !== cat);
		} else {
			formData.category = [...formData.category, cat];
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		error = null;
		success = false;

		if (!formData.name.trim() || !formData.url.trim() || formData.category.length === 0) {
			error = 'Por favor completa todos los campos requeridos (incluyendo al menos una categoría)';
			loading = false;
			return;
		}

		try {
			const result = await resourcesApi.create({
				...formData,
				isActive: false
			});

			if (result.error) throw new Error(result.error.message);

			success = true;
			formData = { name: '', description: '', url: '', category: [] };

			setTimeout(() => {
				onClose();
				success = false;
			}, 2000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al enviar el recurso';
		} finally {
			loading = false;
		}
	}

	function handleClose() {
		if (!loading) {
			formData = { name: '', description: '', url: '', category: [] };
			error = null;
			success = false;
			onClose();
		}
	}
</script>

{#if show}
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
		onclick={handleClose}
		role="presentation"
	>
		<div
			class="bg-background border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-labelledby="modal-title"
		>
			<div class="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
				<div>
					<h2 id="modal-title" class="text-2xl font-bold flex items-center gap-2">
						<Plus class="h-6 w-6" />
						Proponer Recurso
					</h2>
					<p class="text-sm text-muted-foreground mt-1">
						Tu sugerencia será revisada antes de publicarse
					</p>
				</div>
				<Button variant="ghost" size="icon" onclick={handleClose} disabled={loading}>
					<X class="h-5 w-5" />
				</Button>
			</div>

			<div class="p-6">
				{#if error}
					<Alert.Root variant="destructive" class="mb-4">
						<AlertCircle class="h-4 w-4" />
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>{error}</Alert.Description>
					</Alert.Root>
				{/if}

				{#if success}
					<Alert.Root class="mb-4 border-green-200 bg-green-50 text-green-900">
						<Check class="h-4 w-4 text-green-600" />
						<Alert.Title>¡Gracias!</Alert.Title>
						<Alert.Description>
							Tu recurso ha sido enviado y será revisado pronto.
						</Alert.Description>
					</Alert.Root>
				{/if}

				<form onsubmit={handleSubmit} class="space-y-6">
					<div class="space-y-2">
						<Label for="name">Nombre del recurso *</Label>
						<Input
							id="name"
							bind:value={formData.name}
							placeholder="Ej: React Documentation"
							required
							disabled={loading}
						/>
					</div>

					<div class="space-y-2">
						<Label for="url">URL *</Label>
						<Input
							id="url"
							type="url"
							bind:value={formData.url}
							placeholder="https://ejemplo.com"
							required
							disabled={loading}
						/>
					</div>

					<div class="space-y-2">
						<Label for="description">Descripción</Label>
						<Textarea
							id="description"
							bind:value={formData.description}
							placeholder="Describe brevemente el recurso y por qué es útil..."
							rows={4}
							disabled={loading}
						/>
					</div>

					<div class="space-y-2">
						<Label>Categorías * (Selecciona al menos una)</Label>
						<div class="flex flex-wrap gap-2 p-3 border rounded-md bg-background min-h-[100px]">
							{#each categories as cat}
								<button
									type="button"
									onclick={() => toggleCategory(cat)}
									disabled={loading}
									class="px-3 py-1 rounded-full text-sm transition-all disabled:opacity-50 {formData.category.includes(
										cat
									)
										? 'bg-primary text-primary-foreground'
										: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}"
								>
									{cat}
								</button>
							{/each}
						</div>
						{#if formData.category.length > 0}
							<p class="text-xs text-muted-foreground">
								Seleccionadas: {formData.category.join(', ')}
							</p>
						{/if}
					</div>

					<div class="flex gap-3 pt-4">
						<Button type="submit" class="flex-1" disabled={loading}>
							{#if loading}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								Enviando...
							{:else}
								<Check class="mr-2 h-4 w-4" />
								Proponer Recurso
							{/if}
						</Button>
						<Button type="button" variant="outline" onclick={handleClose} disabled={loading}>
							Cancelar
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
