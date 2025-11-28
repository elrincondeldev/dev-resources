<script lang="ts">
	import { onMount } from 'svelte';
	import { resourcesApi } from '$lib/services/resources';
	import type { Resource } from '$lib/types/database.types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';

	import {
		Plus,
		RefreshCw,
		Search,
		Edit,
		Trash2,
		Check,
		X,
		Loader2,
		BarChart3,
		Clock,
		CheckCircle2,
		XCircle,
		ExternalLink,
		LogOut
	} from '@lucide/svelte';

	let resources = $state<Resource[]>([]);
	let pendingResources = $state<Resource[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	let showForm = $state(false);
	let editingResource = $state<Resource | null>(null);
	let formData = $state({
		name: '',
		description: '',
		url: '',
		category: [] as string[],
		isActive: true
	});

	let searchQuery = $state('');
	let selectedCategory = $state<string>('all');
	let showPendingOnly = $state(false);

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

	let filteredResources = $derived(() => {
		let result = showPendingOnly ? pendingResources : resources;

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(r) =>
					r.name.toLowerCase().includes(query) ||
					r.description.toLowerCase().includes(query) ||
					r.category.some((cat) => cat.toLowerCase().includes(query))
			);
		}

		if (selectedCategory !== 'all') {
			result = result.filter((r) => r.category.includes(selectedCategory));
		}

		return result;
	});

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		loading = true;
		error = null;

		try {
			const [activeResult, pendingResult] = await Promise.all([
				resourcesApi.getActive(),
				resourcesApi.getPending()
			]);

			if (activeResult.error) throw new Error(activeResult.error.message);
			if (pendingResult.error) throw new Error(pendingResult.error.message);

			resources = activeResult.data ?? [];
			pendingResources = pendingResult.data ?? [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error cargando recursos';
		} finally {
			loading = false;
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = null;
		successMessage = null;

		if (!formData.name.trim() || !formData.url.trim() || formData.category.length === 0) {
			error = 'Por favor completa todos los campos requeridos (incluyendo al menos una categoría)';
			return;
		}

		try {
			if (editingResource) {
				const result = await resourcesApi.update(editingResource.id, formData);

				if (result.error) throw new Error(result.error.message);

				successMessage = 'Recurso actualizado correctamente';

				if (result.data) {
					if (result.data.isActive) {
						resources = resources.map((r) => (r.id === editingResource!.id ? result.data! : r));
						pendingResources = pendingResources.filter((r) => r.id !== editingResource!.id);
					} else {
						pendingResources = pendingResources.map((r) =>
							r.id === editingResource!.id ? result.data! : r
						);
						resources = resources.filter((r) => r.id !== editingResource!.id);
					}
				}
			} else {
				const result = await resourcesApi.create(formData);

				if (result.error) throw new Error(result.error.message);

				successMessage = 'Recurso creado correctamente';

				if (result.data) {
					if (result.data.isActive) {
						resources = [result.data, ...resources];
					} else {
						pendingResources = [result.data, ...pendingResources];
					}
				}
			}

			resetForm();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al guardar el recurso';
		}
	}

	async function handleApprove(resource: Resource) {
		error = null;
		successMessage = null;

		try {
			const result = await resourcesApi.approve(resource.id);

			if (result.error) throw new Error(result.error.message);

			successMessage = `"${resource.name}" aprobado correctamente`;

			pendingResources = pendingResources.filter((r) => r.id !== resource.id);
			if (result.data) {
				resources = [result.data, ...resources];
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al aprobar el recurso';
		}
	}

	async function handleReject(resource: Resource) {
		error = null;
		successMessage = null;

		try {
			const result = await resourcesApi.reject(resource.id);

			if (result.error) throw new Error(result.error.message);

			successMessage = `"${resource.name}" desactivado correctamente`;

			resources = resources.filter((r) => r.id !== resource.id);
			if (result.data) {
				pendingResources = [result.data, ...pendingResources];
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al desactivar el recurso';
		}
	}

	async function handleDelete(resource: Resource) {
		if (!confirm(`¿Estás seguro de eliminar "${resource.name}"?`)) return;

		error = null;
		successMessage = null;

		try {
			const result = await resourcesApi.delete(resource.id);

			if (result.error) throw new Error(result.error.message);

			successMessage = `"${resource.name}" eliminado correctamente`;

			resources = resources.filter((r) => r.id !== resource.id);
			pendingResources = pendingResources.filter((r) => r.id !== resource.id);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al eliminar el recurso';
		}
	}

	function handleEdit(resource: Resource) {
		editingResource = resource;
		formData = {
			name: resource.name,
			description: resource.description,
			url: resource.url,
			category: resource.category,
			isActive: resource.isActive
		};
		showForm = true;
		error = null;
		successMessage = null;

		setTimeout(() => {
			document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	}

	function resetForm() {
		formData = {
			name: '',
			description: '',
			url: '',
			category: [],
			isActive: true
		};
		editingResource = null;
		showForm = false;
	}

	function toggleCategory(cat: string) {
		if (formData.category.includes(cat)) {
			formData.category = formData.category.filter((c) => c !== cat);
		} else {
			formData.category = [...formData.category, cat];
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	$effect(() => {
		if (successMessage) {
			const timeout = setTimeout(() => {
				successMessage = null;
			}, 5000);
			return () => clearTimeout(timeout);
		}
	});

	async function handleLogout() {
		try {
			await fetch('/api/admin-logout', { method: 'POST' });
			window.location.href = '/';
		} catch (err) {
			console.error('Error al cerrar sesión:', err);
		}
	}
</script>

<div class="min-h-screen bg-linear-to-br from-background to-muted/20 p-4 md:p-8">
	<div class="container mx-auto max-w-7xl space-y-8">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex-1 text-center">
					<h1
						class="text-4xl md:text-5xl font-bold tracking-tight flex items-center justify-center gap-3"
					>
						<BarChart3 class="h-10 w-10 text-primary" />
						Admin Dashboard
					</h1>
					<p class="text-lg text-muted-foreground mt-2">
						Gestiona todos los recursos de desarrollo
					</p>
				</div>
				<Button variant="ghost" size="sm" onclick={handleLogout} class="absolute top-4 right-4">
					<LogOut class="h-4 w-4 mr-2" />
					Salir
				</Button>
			</div>
		</div>

		{#if error}
			<Alert.Root variant="destructive" class="animate-in slide-in-from-top duration-300">
				<XCircle class="h-4 w-4" />
				<Alert.Title>Error</Alert.Title>
				<Alert.Description class="flex items-center justify-between">
					<span>{error}</span>
					<Button variant="ghost" size="sm" onclick={() => (error = null)}>
						<X class="h-4 w-4" />
					</Button>
				</Alert.Description>
			</Alert.Root>
		{/if}

		{#if successMessage}
			<Alert.Root
				class="animate-in slide-in-from-top duration-300 border-green-200 bg-green-50 text-green-900"
			>
				<CheckCircle2 class="h-4 w-4 text-green-600" />
				<Alert.Title>Éxito</Alert.Title>
				<Alert.Description class="flex items-center justify-between">
					<span>{successMessage}</span>
					<Button variant="ghost" size="sm" onclick={() => (successMessage = null)}>
						<X class="h-4 w-4" />
					</Button>
				</Alert.Description>
			</Alert.Root>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<Card.Root class="bg-linear-to-br from-blue-500 to-blue-600 text-white border-0">
				<Card.Header class="pb-2">
					<Card.Description class="text-blue-100">Recursos Activos</Card.Description>
					<Card.Title class="text-4xl font-bold">{resources.length}</Card.Title>
				</Card.Header>
			</Card.Root>

			<Card.Root class="bg-linear-to-br from-orange-500 to-orange-600 text-white border-0">
				<Card.Header class="pb-2">
					<Card.Description class="text-orange-100">Pendientes de Aprobación</Card.Description>
					<Card.Title class="text-4xl font-bold">{pendingResources.length}</Card.Title>
				</Card.Header>
			</Card.Root>

			<Card.Root class="bg-linear-to-br from-purple-500 to-purple-600 text-white border-0">
				<Card.Header class="pb-2">
					<Card.Description class="text-purple-100">Total de Recursos</Card.Description>
					<Card.Title class="text-4xl font-bold"
						>{resources.length + pendingResources.length}</Card.Title
					>
				</Card.Header>
			</Card.Root>
		</div>

		<div class="flex flex-col sm:flex-row justify-between gap-4">
			<div class="flex flex-wrap gap-3">
				<Button onclick={() => (showForm = !showForm)} size="lg">
					{#if showForm}
						<X class="mr-2 h-5 w-5" />
						Cerrar Formulario
					{:else}
						<Plus class="mr-2 h-5 w-5" />
						Nuevo Recurso
					{/if}
				</Button>

				<Button
					variant={showPendingOnly ? 'default' : 'outline'}
					size="lg"
					onclick={() => (showPendingOnly = !showPendingOnly)}
				>
					<Clock class="mr-2 h-5 w-5" />
					{showPendingOnly ? 'Ver Todos' : 'Ver Pendientes'}
					{#if pendingResources.length > 0 && !showPendingOnly}
						<Badge variant="secondary" class="ml-2">{pendingResources.length}</Badge>
					{/if}
				</Button>
			</div>

			<Button variant="outline" size="lg" onclick={loadData} disabled={loading}>
				<RefreshCw class={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
				Recargar
			</Button>
		</div>

		{#if showForm}
			<Card.Root id="form-section" class="animate-in slide-in-from-top duration-300">
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						{#if editingResource}
							<Edit class="h-5 w-5" />
							Editar Recurso
						{:else}
							<Plus class="h-5 w-5" />
							Crear Nuevo Recurso
						{/if}
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<form onsubmit={handleSubmit} class="space-y-6">
						<div class="space-y-2">
							<Label for="name">Nombre *</Label>
							<Input
								id="name"
								bind:value={formData.name}
								placeholder="Ej: React Documentation"
								required
							/>
						</div>

						<div class="space-y-2">
							<Label>Categorías * (Selecciona al menos una)</Label>
							<div class="flex flex-wrap gap-2 p-3 border rounded-md bg-background min-h-[100px]">
								{#each categories as cat}
									<button
										type="button"
										onclick={() => toggleCategory(cat)}
										class="px-3 py-1 rounded-full text-sm transition-all {formData.category.includes(
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

						<div class="space-y-2">
							<Label for="url">URL *</Label>
							<Input
								id="url"
								type="url"
								bind:value={formData.url}
								placeholder="https://ejemplo.com"
								required
							/>
						</div>

						<div class="space-y-2">
							<Label for="description">Descripción</Label>
							<Textarea
								id="description"
								bind:value={formData.description}
								placeholder="Describe el recurso..."
								rows={4}
							/>
						</div>

						<div class="flex items-center space-x-2">
							<input
								type="checkbox"
								id="isActive"
								bind:checked={formData.isActive}
								class="h-4 w-4 rounded border-gray-300"
							/>
							<Label for="isActive" class="cursor-pointer">Activar recurso inmediatamente</Label>
						</div>

						<div class="flex gap-3">
							<Button type="submit" class="flex-1">
								{#if editingResource}
									<Check class="mr-2 h-5 w-5" />
									Guardar Cambios
								{:else}
									<Plus class="mr-2 h-5 w-5" />
									Crear Recurso
								{/if}
							</Button>
							<Button type="button" variant="outline" onclick={resetForm}>
								<X class="mr-2 h-5 w-5" />
								Cancelar
							</Button>
						</div>
					</form>
				</Card.Content>
			</Card.Root>
		{/if}

		<Card.Root>
			<Card.Content class="pt-6">
				<div class="flex flex-col md:flex-row gap-4">
					<div class="relative flex-1">
						<Search class="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
						<Input bind:value={searchQuery} placeholder="Buscar recursos..." class="pl-10" />
					</div>

					<select
						bind:value={selectedCategory}
						class="flex h-9 w-full md:w-[200px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="all">Todas las categorías</option>
						{#each categories as cat}
							<option value={cat}>{cat}</option>
						{/each}
					</select>
				</div>
			</Card.Content>
		</Card.Root>

		{#if loading}
			<div class="flex flex-col items-center justify-center py-20 space-y-4">
				<Loader2 class="h-12 w-12 animate-spin text-primary" />
				<p class="text-muted-foreground">Cargando recursos...</p>
			</div>
		{:else if filteredResources().length === 0}
			<Card.Root>
				<Card.Content class="flex flex-col items-center justify-center py-20 space-y-4">
					<div class="text-6xl">📦</div>
					<p class="text-xl font-semibold">
						{showPendingOnly ? 'No hay recursos pendientes' : 'No se encontraron recursos'}
					</p>
					<p class="text-muted-foreground">
						{searchQuery || selectedCategory !== 'all'
							? 'Intenta ajustar los filtros'
							: 'Crea tu primer recurso usando el botón de arriba'}
					</p>
				</Card.Content>
			</Card.Root>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredResources() as resource (resource.id)}
					<Card.Root
						class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 {!resource.isActive
							? 'border-orange-300 bg-orange-50/50'
							: ''}"
					>
						<Card.Header>
							<div class="mb-2">
								<div class="flex justify-between items-start gap-3 mb-2">
									<Card.Title class="text-xl leading-tight">{resource.name}</Card.Title>
									{#if resource.isActive}
										<Badge class="bg-green-100 text-green-800 hover:bg-green-100 shrink-0">
											<Check class="h-3 w-3 mr-1" />
											Activo
										</Badge>
									{:else}
										<Badge
											variant="outline"
											class="bg-orange-100 text-orange-800 border-orange-300 shrink-0"
										>
											<Clock class="h-3 w-3 mr-1" />
											Pendiente
										</Badge>
									{/if}
								</div>
								<div class="flex flex-wrap gap-1 mb-2">
									{#each resource.category as cat}
										<Badge variant="secondary" class="text-xs">{cat}</Badge>
									{/each}
								</div>
							</div>

							{#if resource.description}
								<Card.Description class="line-clamp-3">
									{resource.description}
								</Card.Description>
							{/if}
						</Card.Header>

						<Card.Content>
							<a
								href={resource.url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-sm text-primary hover:underline flex items-center gap-1 mb-2"
							>
								<ExternalLink class="h-3 w-3" />
								{resource.url}
							</a>

							<p class="text-xs text-muted-foreground border-t pt-3">
								📅 {formatDate(resource.created_at)}
							</p>
						</Card.Content>

						<Card.Footer class="flex flex-wrap gap-2">
							{#if !resource.isActive}
								<Button size="sm" variant="default" onclick={() => handleApprove(resource)}>
									<Check class="mr-1 h-4 w-4" />
									Aprobar
								</Button>
							{:else}
								<Button size="sm" variant="outline" onclick={() => handleReject(resource)}>
									<Clock class="mr-1 h-4 w-4" />
									Desactivar
								</Button>
							{/if}
							<Button size="sm" variant="outline" onclick={() => handleEdit(resource)}>
								<Edit class="mr-1 h-4 w-4" />
								Editar
							</Button>
							<Button size="sm" variant="destructive" onclick={() => handleDelete(resource)}>
								<Trash2 class="mr-1 h-4 w-4" />
								Eliminar
							</Button>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		{/if}
	</div>
</div>
