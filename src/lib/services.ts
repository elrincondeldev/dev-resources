/**
 * SERVICIOS DE BASE DE DATOS
 * 
 * Define aquí los servicios para tus tablas.
 * Esto permite reutilizar los servicios en toda la aplicación.
 * 
 * Ejemplo de uso:
 * import { usersService, postsService } from '$lib/services';
 */

import { createDbService } from '$lib/db';
import type { User, Post, Comment, Category } from '$lib/types/database.types';

// ============================================================================
// SERVICIOS BÁSICOS
// ============================================================================

/**
 * Servicio para la tabla 'users'
 * 
 * @example
 * import { usersService } from '$lib/services';
 * 
 * const { data } = await usersService.getAll();
 * const user = await usersService.getById('user-id');
 */
export const usersService = createDbService<User>('users');

/**
 * Servicio para la tabla 'posts'
 */
export const postsService = createDbService<Post>('posts');

/**
 * Servicio para la tabla 'comments'
 */
export const commentsService = createDbService<Comment>('comments');

/**
 * Servicio para la tabla 'categories'
 */
export const categoriesService = createDbService<Category>('categories');

// ============================================================================
// SERVICIOS EXTENDIDOS CON LÓGICA PERSONALIZADA
// ============================================================================

/**
 * Servicio de usuarios extendido con funciones personalizadas
 */
export const usersApi = {
	...usersService,

	/**
	 * Buscar usuario por email
	 */
	async findByEmail(email: string) {
		const { data, error } = await usersService.getWhere({ email });
		return { data: data?.[0] || null, error };
	},

	/**
	 * Obtener usuarios activos
	 */
	async getActive() {
		const { data, error } = await usersService.getWhere(
			{ active: true } as any,
			{ orderBy: 'created_at', ascending: false }
		);
		return { data, error };
	}
};

/**
 * Servicio de posts extendido
 */
export const postsApi = {
	...postsService,

	/**
	 * Obtener posts publicados
	 */
	async getPublished(limit = 10) {
		const { data, error } = await postsService.getWhere(
			{ published: true },
			{ orderBy: 'created_at', ascending: false, limit }
		);
		return { data, error };
	},

	/**
	 * Obtener posts de un usuario
	 */
	async getByUser(userId: string) {
		const { data, error } = await postsService.getWhere(
			{ user_id: userId },
			{ orderBy: 'created_at', ascending: false }
		);
		return { data, error };
	},

	/**
	 * Publicar un post
	 */
	async publish(postId: number) {
		return await postsService.update(postId, { published: true });
	},

	/**
	 * Despublicar un post
	 */
	async unpublish(postId: number) {
		return await postsService.update(postId, { published: false });
	}
};

// ============================================================================
// EJEMPLO DE SERVICIO CON QUERIES COMPLEJAS
// ============================================================================

import { supabase } from '$lib/supabase';

/**
 * Servicio de posts con queries complejas usando el cliente de Supabase
 */
export const postsAdvanced = {
	/**
	 * Obtener posts con información del usuario
	 */
	async getPostsWithUser() {
		const { data, error } = await supabase
			.from('posts')
			.select(
				`
        *,
        user:users (
          id,
          name,
          email,
          avatar_url
        )
      `
			)
			.eq('published', true)
			.order('created_at', { ascending: false });

		return { data, error };
	},

	/**
	 * Obtener un post con todos sus detalles (usuario + comentarios)
	 */
	async getPostWithDetails(postId: number) {
		const { data, error } = await supabase
			.from('posts')
			.select(
				`
        *,
        user:users (
          id,
          name,
          avatar_url
        ),
        comments (
          id,
          content,
          created_at,
          user:users (
            id,
            name,
            avatar_url
          )
        )
      `
			)
			.eq('id', postId)
			.single();

		return { data, error };
	},

	/**
	 * Buscar posts por título (full text search)
	 */
	async searchByTitle(query: string) {
		const { data, error } = await supabase
			.from('posts')
			.select('*')
			.textSearch('title', query)
			.eq('published', true)
			.limit(20);

		return { data, error };
	}
};

// ============================================================================
// EJEMPLO DE USO
// ============================================================================

/**
 * Función de ejemplo que muestra cómo usar los servicios
 */
export async function exampleUsage() {
	// Usar servicio básico
	const { data: users } = await usersService.getAll();

	// Usar servicio extendido
	const { data: user } = await usersApi.findByEmail('test@example.com');

	// Usar servicio avanzado
	const { data: posts } = await postsAdvanced.getPostsWithUser();

	return { users, user, posts };
}

