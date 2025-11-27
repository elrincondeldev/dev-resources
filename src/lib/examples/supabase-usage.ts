/**
 * EJEMPLOS DE USO - Operaciones CRUD con Supabase
 * 
 * Este archivo muestra cómo usar las funciones helper de base de datos
 */

import { createDbService } from '../db';
import type { DbResult } from '../db';

// ============================================================================
// PASO 1: Define el tipo de tu tabla
// ============================================================================

interface User {
	id: string;
	email: string;
	name: string;
	created_at: string;
	updated_at?: string;
}

interface Post {
	id: number;
	title: string;
	content: string;
	user_id: string;
	created_at: string;
}

// ============================================================================
// PASO 2: Crea un servicio para tu tabla
// ============================================================================

const usersDb = createDbService<User>('users');
const postsDb = createDbService<Post>('posts');

// ============================================================================
// EJEMPLOS DE USO
// ============================================================================

// ----------------------------------------------------------------------------
// GET - Obtener todos los registros
// ----------------------------------------------------------------------------

export async function getAllUsers() {
	const { data, error } = await usersDb.getAll();
	
	if (error) {
		console.error('Error:', error.message);
		return;
	}
	
	console.log('Usuarios:', data);
	return data;
}

// Con opciones de ordenamiento y límite
export async function getRecentUsers() {
	const { data, error } = await usersDb.getAll({
		orderBy: 'created_at',
		ascending: false,
		limit: 10
	});
	
	return { data, error };
}

// ----------------------------------------------------------------------------
// GET - Obtener un registro por ID
// ----------------------------------------------------------------------------

export async function getUserById(userId: string) {
	const { data, error } = await usersDb.getById(userId);
	
	if (error) {
		console.error('Error:', error.message);
		return null;
	}
	
	return data;
}

// ----------------------------------------------------------------------------
// GET - Buscar con filtros
// ----------------------------------------------------------------------------

export async function getUserByEmail(email: string) {
	const { data, error } = await usersDb.getWhere({ email });
	
	if (error) {
		console.error('Error:', error.message);
		return null;
	}
	
	return data?.[0]; // Retorna el primer resultado
}

export async function getPostsByUser(userId: string) {
	const { data, error } = await postsDb.getWhere(
		{ user_id: userId },
		{ orderBy: 'created_at', ascending: false }
	);
	
	return { data, error };
}

// ----------------------------------------------------------------------------
// CREATE - Crear un nuevo registro
// ----------------------------------------------------------------------------

export async function createUser(email: string, name: string) {
	const { data, error } = await usersDb.create({
		email,
		name
	});
	
	if (error) {
		console.error('Error creando usuario:', error.message);
		return null;
	}
	
	console.log('Usuario creado:', data);
	return data;
}

export async function createPost(title: string, content: string, userId: string) {
	const { data, error } = await postsDb.create({
		title,
		content,
		user_id: userId
	});
	
	return { data, error };
}

// ----------------------------------------------------------------------------
// CREATE - Crear múltiples registros
// ----------------------------------------------------------------------------

export async function createMultipleUsers(users: Array<{ email: string; name: string }>) {
	const { data, error } = await usersDb.createMany(users);
	
	if (error) {
		console.error('Error creando usuarios:', error.message);
		return null;
	}
	
	console.log(`${data?.length} usuarios creados`);
	return data;
}

// ----------------------------------------------------------------------------
// UPDATE - Actualizar un registro
// ----------------------------------------------------------------------------

export async function updateUserName(userId: string, newName: string) {
	const { data, error } = await usersDb.update(userId, {
		name: newName
	});
	
	if (error) {
		console.error('Error actualizando usuario:', error.message);
		return null;
	}
	
	console.log('Usuario actualizado:', data);
	return data;
}

export async function updatePost(postId: number, updates: { title?: string; content?: string }) {
	const { data, error } = await postsDb.update(postId, updates);
	
	return { data, error };
}

// ----------------------------------------------------------------------------
// UPDATE - Actualizar múltiples registros
// ----------------------------------------------------------------------------

export async function updateUserPostsByUser(userId: string, newTitle: string) {
	const { data, error } = await postsDb.updateWhere(
		{ user_id: userId },
		{ title: newTitle }
	);
	
	return { data, error };
}

// ----------------------------------------------------------------------------
// DELETE - Eliminar un registro
// ----------------------------------------------------------------------------

export async function deleteUser(userId: string) {
	const { data, error } = await usersDb.delete(userId);
	
	if (error) {
		console.error('Error eliminando usuario:', error.message);
		return false;
	}
	
	console.log('Usuario eliminado:', data);
	return true;
}

export async function deletePost(postId: number) {
	const { data, error } = await postsDb.delete(postId);
	
	return { data, error };
}

// ----------------------------------------------------------------------------
// DELETE - Eliminar múltiples registros
// ----------------------------------------------------------------------------

export async function deletePostsByUser(userId: string) {
	const { data, error } = await postsDb.deleteWhere({ user_id: userId });
	
	if (error) {
		console.error('Error eliminando posts:', error.message);
		return null;
	}
	
	console.log(`${data?.length} posts eliminados`);
	return data;
}

// ----------------------------------------------------------------------------
// COUNT - Contar registros
// ----------------------------------------------------------------------------

export async function countAllUsers() {
	const { data: count, error } = await usersDb.count();
	
	if (error) {
		console.error('Error contando usuarios:', error.message);
		return 0;
	}
	
	return count ?? 0;
}

export async function countPostsByUser(userId: string) {
	const { data: count, error } = await postsDb.count({ user_id: userId });
	
	return count ?? 0;
}

// ============================================================================
// USO EN UN COMPONENTE SVELTE
// ============================================================================

/**
 * Ejemplo de uso en un componente Svelte:
 * 
 * <script lang="ts">
 *   import { onMount } from 'svelte';
 *   import { usersDb } from '$lib/db';
 * 
 *   let users = $state<User[]>([]);
 *   let loading = $state(true);
 *   let error = $state<string | null>(null);
 * 
 *   onMount(async () => {
 *     const result = await usersDb.getAll();
 *     
 *     if (result.error) {
 *       error = result.error.message;
 *     } else {
 *       users = result.data ?? [];
 *     }
 *     
 *     loading = false;
 *   });
 * 
 *   async function handleCreateUser() {
 *     const result = await usersDb.create({
 *       email: 'nuevo@ejemplo.com',
 *       name: 'Usuario Nuevo'
 *     });
 *     
 *     if (result.data) {
 *       users = [...users, result.data];
 *     }
 *   }
 * 
 *   async function handleDeleteUser(userId: string) {
 *     const result = await usersDb.delete(userId);
 *     
 *     if (!result.error) {
 *       users = users.filter(u => u.id !== userId);
 *     }
 *   }
 * </script>
 * 
 * {#if loading}
 *   <p>Cargando...</p>
 * {:else if error}
 *   <p>Error: {error}</p>
 * {:else}
 *   <ul>
 *     {#each users as user}
 *       <li>
 *         {user.name} - {user.email}
 *         <button onclick={() => handleDeleteUser(user.id)}>Eliminar</button>
 *       </li>
 *     {/each}
 *   </ul>
 *   <button onclick={handleCreateUser}>Crear Usuario</button>
 * {/if}
 */

