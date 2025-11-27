/**
 * REFERENCIA RÁPIDA - Supabase CRUD
 * 
 * Copia y pega estos ejemplos según necesites
 */

import { createDbService } from '$lib/db';

// ============================================================================
// CONFIGURACIÓN INICIAL
// ============================================================================

interface MyTable {
	id: number;
	name: string;
	email: string;
	created_at: string;
}

const db = createDbService<MyTable>('my_table_name');

// ============================================================================
// OPERACIONES BÁSICAS (Copy & Paste)
// ============================================================================

// 📖 GET ALL - Obtener todos
export async function getAll() {
	const { data, error } = await db.getAll();
	if (error) console.error(error);
	return data;
}

// 📖 GET ONE - Obtener uno por ID
export async function getOne(id: number) {
	const { data, error } = await db.getById(id);
	if (error) console.error(error);
	return data;
}

// 🔍 SEARCH - Buscar con filtros
export async function search(email: string) {
	const { data, error } = await db.getWhere({ email });
	if (error) console.error(error);
	return data;
}

// ➕ CREATE - Crear uno
export async function createOne(name: string, email: string) {
	const { data, error } = await db.create({ name, email });
	if (error) console.error(error);
	return data;
}

// ➕ CREATE MANY - Crear varios
export async function createMany(items: Array<{ name: string; email: string }>) {
	const { data, error } = await db.createMany(items);
	if (error) console.error(error);
	return data;
}

// ✏️ UPDATE - Actualizar
export async function updateOne(id: number, name: string) {
	const { data, error } = await db.update(id, { name });
	if (error) console.error(error);
	return data;
}

// 🗑️ DELETE - Eliminar
export async function deleteOne(id: number) {
	const { data, error } = await db.delete(id);
	if (error) console.error(error);
	return data;
}

// 🔢 COUNT - Contar
export async function count() {
	const { data, error } = await db.count();
	if (error) console.error(error);
	return data;
}

// ============================================================================
// OPCIONES AVANZADAS
// ============================================================================

// Con ordenamiento y límite
export async function getWithOptions() {
	return await db.getAll({
		orderBy: 'created_at',
		ascending: false,
		limit: 10
	});
}

// Con paginación
export async function getPage(page: number, pageSize: number) {
	return await db.getAll({
		limit: pageSize,
		offset: (page - 1) * pageSize,
		orderBy: 'created_at',
		ascending: false
	});
}

// Actualizar múltiples
export async function updateMultiple() {
	return await db.updateWhere({ name: 'old' }, { name: 'new' });
}

// Eliminar múltiples
export async function deleteMultiple() {
	return await db.deleteWhere({ name: 'test' });
}

// ============================================================================
// PATRON TÍPICO EN SVELTE
// ============================================================================

/*
<script lang="ts">
  import { onMount } from 'svelte';
  import { createDbService } from '$lib/db';
  
  interface Item {
    id: number;
    name: string;
  }
  
  const db = createDbService<Item>('items');
  
  let items = $state<Item[]>([]);
  let loading = $state(false);
  
  onMount(async () => {
    loading = true;
    const { data } = await db.getAll();
    items = data ?? [];
    loading = false;
  });
  
  async function create(name: string) {
    const { data, error } = await db.create({ name });
    if (data) items = [...items, data];
  }
  
  async function update(id: number, name: string) {
    const { data } = await db.update(id, { name });
    if (data) items = items.map(i => i.id === id ? data : i);
  }
  
  async function remove(id: number) {
    const { error } = await db.delete(id);
    if (!error) items = items.filter(i => i.id !== id);
  }
</script>
*/

// ============================================================================
// USO EN SERVER LOAD
// ============================================================================

/*
// +page.server.ts
import type { PageServerLoad } from './$types';
import { createDbService } from '$lib/db';

interface Item {
  id: number;
  name: string;
}

const db = createDbService<Item>('items');

export const load: PageServerLoad = async () => {
  const { data, error } = await db.getAll();
  
  return {
    items: data ?? [],
    error: error?.message
  };
};
*/

// ============================================================================
// MANEJO DE ERRORES
// ============================================================================

export async function withErrorHandling() {
	const { data, error } = await db.getAll();

	if (error) {
		// Manejar error específico
		switch (error.code) {
			case '42P01':
				console.error('Tabla no existe');
				break;
			case 'PGRST301':
				console.error('Error de autenticación');
				break;
			default:
				console.error('Error:', error.message);
		}
		return null;
	}

	return data;
}

// ============================================================================
// QUERIES COMPLEJAS (usa el cliente directo)
// ============================================================================

import { supabase } from '$lib/supabase';

export async function complexQuery() {
	// JOIN con otra tabla
	const { data, error } = await supabase
		.from('users')
		.select(
			`
      *,
      posts (
        id,
        title
      )
    `
		)
		.eq('active', true)
		.order('created_at', { ascending: false });

	return { data, error };
}

export async function fullTextSearch(query: string) {
	const { data, error } = await supabase
		.from('posts')
		.select('*')
		.textSearch('title', query);

	return { data, error };
}

export async function rangeQuery() {
	const { data, error } = await supabase
		.from('products')
		.select('*')
		.gte('price', 10)
		.lte('price', 100);

	return { data, error };
}

