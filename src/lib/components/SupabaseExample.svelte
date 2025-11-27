<script lang="ts">
	import { onMount } from 'svelte';
	import { createDbService } from '$lib/db';
	import type { DbResult } from '$lib/db';

	// Define el tipo de tu tabla (ajusta esto según tu base de datos)
	interface Item {
		id: number;
		name: string;
		description?: string;
		created_at: string;
	}

	// Crea el servicio de base de datos (cambia 'items' por el nombre de tu tabla)
	const itemsDb = createDbService<Item>('items');

	// Estado del componente
	let items = $state<Item[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	// Formulario para crear/editar
	let formName = $state('');
	let formDescription = $state('');
	let editingId = $state<number | null>(null);

	// Cargar datos al montar
	onMount(async () => {
		await loadItems();
	});

	// Función para cargar items
	async function loadItems() {
		loading = true;
		error = null;

		const result = await itemsDb.getAll({
			orderBy: 'created_at',
			ascending: false
		});

		if (result.error) {
			error = result.error.message;
		} else {
			items = result.data ?? [];
		}

		loading = false;
	}

	// Crear o actualizar item
	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = null;
		successMessage = null;

		if (!formName.trim()) {
			error = 'El nombre es requerido';
			return;
		}

		if (editingId !== null) {
			// UPDATE
			const result = await itemsDb.update(editingId, {
				name: formName,
				description: formDescription || undefined
			});

			if (result.error) {
				error = result.error.message;
			} else if (result.data) {
				items = items.map((item) => (item.id === editingId ? result.data! : item));
				successMessage = 'Item actualizado correctamente';
				resetForm();
			}
		} else {
			// CREATE
			const result = await itemsDb.create({
				name: formName,
				description: formDescription || undefined
			});

			if (result.error) {
				error = result.error.message;
			} else if (result.data) {
				items = [result.data, ...items];
				successMessage = 'Item creado correctamente';
				resetForm();
			}
		}
	}

	// Editar item
	function handleEdit(item: Item) {
		editingId = item.id;
		formName = item.name;
		formDescription = item.description || '';
		error = null;
		successMessage = null;
	}

	// Eliminar item
	async function handleDelete(id: number) {
		if (!confirm('¿Estás seguro de que quieres eliminar este item?')) {
			return;
		}

		error = null;
		successMessage = null;

		const result = await itemsDb.delete(id);

		if (result.error) {
			error = result.error.message;
		} else {
			items = items.filter((item) => item.id !== id);
			successMessage = 'Item eliminado correctamente';
		}
	}

	// Resetear formulario
	function resetForm() {
		formName = '';
		formDescription = '';
		editingId = null;
	}

	// Formatear fecha
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
</script>

<div class="container">
	<h1>Ejemplo de CRUD con Supabase</h1>

	<!-- Mensajes -->
	{#if error}
		<div class="alert alert-error">
			❌ {error}
		</div>
	{/if}

	{#if successMessage}
		<div class="alert alert-success">
			✅ {successMessage}
		</div>
	{/if}

	<!-- Formulario -->
	<form onsubmit={handleSubmit} class="form">
		<h2>{editingId !== null ? 'Editar Item' : 'Crear Nuevo Item'}</h2>

		<div class="form-group">
			<label for="name">Nombre *</label>
			<input
				type="text"
				id="name"
				bind:value={formName}
				placeholder="Nombre del item"
				required
			/>
		</div>

		<div class="form-group">
			<label for="description">Descripción</label>
			<textarea
				id="description"
				bind:value={formDescription}
				placeholder="Descripción opcional"
				rows="3"
			></textarea>
		</div>

		<div class="form-actions">
			<button type="submit" class="btn btn-primary">
				{editingId !== null ? 'Actualizar' : 'Crear'}
			</button>

			{#if editingId !== null}
				<button type="button" onclick={resetForm} class="btn btn-secondary">
					Cancelar
				</button>
			{/if}
		</div>
	</form>

	<!-- Lista de items -->
	<div class="items-section">
		<div class="section-header">
			<h2>Items ({items.length})</h2>
			<button onclick={loadItems} class="btn btn-small" disabled={loading}>
				{loading ? 'Cargando...' : '🔄 Recargar'}
			</button>
		</div>

		{#if loading}
			<div class="loading">Cargando items...</div>
		{:else if items.length === 0}
			<div class="empty-state">
				<p>No hay items aún</p>
				<p class="empty-hint">Crea tu primer item usando el formulario de arriba</p>
			</div>
		{:else}
			<div class="items-grid">
				{#each items as item (item.id)}
					<div class="item-card">
						<div class="item-header">
							<h3>{item.name}</h3>
							<span class="item-date">{formatDate(item.created_at)}</span>
						</div>

						{#if item.description}
							<p class="item-description">{item.description}</p>
						{/if}

						<div class="item-actions">
							<button onclick={() => handleEdit(item)} class="btn btn-small btn-secondary">
								✏️ Editar
							</button>
							<button onclick={() => handleDelete(item.id)} class="btn btn-small btn-danger">
								🗑️ Eliminar
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 2rem;
		color: #1a1a1a;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #2a2a2a;
	}

	/* Alertas */
	.alert {
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.alert-error {
		background-color: #fee;
		color: #c00;
		border: 1px solid #fcc;
	}

	.alert-success {
		background-color: #efe;
		color: #060;
		border: 1px solid #cfc;
	}

	/* Formulario */
	.form {
		background: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #333;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.375rem;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.form-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}

	/* Botones */
	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background-color: #3b82f6;
		color: white;
	}

	.btn-primary:hover {
		background-color: #2563eb;
	}

	.btn-secondary {
		background-color: #e5e7eb;
		color: #374151;
	}

	.btn-secondary:hover {
		background-color: #d1d5db;
	}

	.btn-danger {
		background-color: #ef4444;
		color: white;
	}

	.btn-danger:hover {
		background-color: #dc2626;
	}

	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Sección de items */
	.items-section {
		background: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.loading {
		text-align: center;
		padding: 3rem;
		color: #666;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: #666;
	}

	.empty-hint {
		font-size: 0.875rem;
		color: #999;
		margin-top: 0.5rem;
	}

	/* Grid de items */
	.items-grid {
		display: grid;
		gap: 1rem;
	}

	.item-card {
		padding: 1.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		transition: box-shadow 0.2s;
	}

	.item-card:hover {
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: start;
		margin-bottom: 0.75rem;
	}

	.item-header h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0;
	}

	.item-date {
		font-size: 0.75rem;
		color: #999;
		white-space: nowrap;
	}

	.item-description {
		color: #666;
		margin-bottom: 1rem;
		line-height: 1.5;
	}

	.item-actions {
		display: flex;
		gap: 0.5rem;
	}
</style>

