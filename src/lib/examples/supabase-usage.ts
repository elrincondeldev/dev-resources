import { createDbService } from '../db';
import type { DbResult } from '../db';

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

const usersDb = createDbService<User>('users');
const postsDb = createDbService<Post>('posts');

export async function getAllUsers() {
	const { data, error } = await usersDb.getAll();

	if (error) {
		console.error('Error:', error.message);
		return;
	}

	console.log('Usuarios:', data);
	return data;
}

export async function getRecentUsers() {
	const { data, error } = await usersDb.getAll({
		orderBy: 'created_at',
		ascending: false,
		limit: 10
	});

	return { data, error };
}

export async function getUserById(userId: string) {
	const { data, error } = await usersDb.getById(userId);

	if (error) {
		console.error('Error:', error.message);
		return null;
	}

	return data;
}

export async function getUserByEmail(email: string) {
	const { data, error } = await usersDb.getWhere({ email });

	if (error) {
		console.error('Error:', error.message);
		return null;
	}

	return data?.[0];
}

export async function getPostsByUser(userId: string) {
	const { data, error } = await postsDb.getWhere(
		{ user_id: userId },
		{ orderBy: 'created_at', ascending: false }
	);

	return { data, error };
}

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

export async function createMultipleUsers(users: Array<{ email: string; name: string }>) {
	const { data, error } = await usersDb.createMany(users);

	if (error) {
		console.error('Error creando usuarios:', error.message);
		return null;
	}

	console.log(`${data?.length} usuarios creados`);
	return data;
}

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

export async function updateUserPostsByUser(userId: string, newTitle: string) {
	const { data, error } = await postsDb.updateWhere({ user_id: userId }, { title: newTitle });

	return { data, error };
}

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

export async function deletePostsByUser(userId: string) {
	const { data, error } = await postsDb.deleteWhere({ user_id: userId });

	if (error) {
		console.error('Error eliminando posts:', error.message);
		return null;
	}

	console.log(`${data?.length} posts eliminados`);
	return data;
}

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
