import { createDbService } from '$lib/db';
import type { User, Post, Comment, Category } from '$lib/types/database.types';

export const usersService = createDbService<User>('users');

export const postsService = createDbService<Post>('posts');

export const commentsService = createDbService<Comment>('comments');

export const categoriesService = createDbService<Category>('categories');

export const usersApi = {
	...usersService,

	async findByEmail(email: string) {
		const { data, error } = await usersService.getWhere({ email });
		return { data: data?.[0] || null, error };
	},

	async getActive() {
		const { data, error } = await usersService.getWhere({ active: true } as any, {
			orderBy: 'created_at',
			ascending: false
		});
		return { data, error };
	}
};

export const postsApi = {
	...postsService,

	async getPublished(limit = 10) {
		const { data, error } = await postsService.getWhere(
			{ published: true },
			{ orderBy: 'created_at', ascending: false, limit }
		);
		return { data, error };
	},

	async getByUser(userId: string) {
		const { data, error } = await postsService.getWhere(
			{ user_id: userId },
			{ orderBy: 'created_at', ascending: false }
		);
		return { data, error };
	},

	async publish(postId: number) {
		return await postsService.update(postId, { published: true });
	},

	async unpublish(postId: number) {
		return await postsService.update(postId, { published: false });
	}
};

import { supabase } from '$lib/supabase';

export const postsAdvanced = {
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

export async function exampleUsage() {
	const { data: users } = await usersService.getAll();

	const { data: user } = await usersApi.findByEmail('test@example.com');

	const { data: posts } = await postsAdvanced.getPostsWithUser();

	return { users, user, posts };
}
