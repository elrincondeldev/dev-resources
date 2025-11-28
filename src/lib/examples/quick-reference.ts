import { createDbService } from '$lib/db';

interface MyTable {
	id: number;
	name: string;
	email: string;
	created_at: string;
}

const db = createDbService<MyTable>('my_table_name');

export async function getAll() {
	const { data, error } = await db.getAll();
	if (error) console.error(error);
	return data;
}

export async function getOne(id: number) {
	const { data, error } = await db.getById(id);
	if (error) console.error(error);
	return data;
}

export async function search(email: string) {
	const { data, error } = await db.getWhere({ email });
	if (error) console.error(error);
	return data;
}

export async function createOne(name: string, email: string) {
	const { data, error } = await db.create({ name, email });
	if (error) console.error(error);
	return data;
}

export async function createMany(items: Array<{ name: string; email: string }>) {
	const { data, error } = await db.createMany(items);
	if (error) console.error(error);
	return data;
}

export async function updateOne(id: number, name: string) {
	const { data, error } = await db.update(id, { name });
	if (error) console.error(error);
	return data;
}

export async function deleteOne(id: number) {
	const { data, error } = await db.delete(id);
	if (error) console.error(error);
	return data;
}

export async function count() {
	const { data, error } = await db.count();
	if (error) console.error(error);
	return data;
}

export async function getWithOptions() {
	return await db.getAll({
		orderBy: 'created_at',
		ascending: false,
		limit: 10
	});
}

export async function getPage(page: number, pageSize: number) {
	return await db.getAll({
		limit: pageSize,
		offset: (page - 1) * pageSize,
		orderBy: 'created_at',
		ascending: false
	});
}

export async function updateMultiple() {
	return await db.updateWhere({ name: 'old' }, { name: 'new' });
}

export async function deleteMultiple() {
	return await db.deleteWhere({ name: 'test' });
}

export async function withErrorHandling() {
	const { data, error } = await db.getAll();

	if (error) {
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

import { supabase } from '$lib/supabase';

export async function complexQuery() {
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
	const { data, error } = await supabase.from('posts').select('*').textSearch('title', query);

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
