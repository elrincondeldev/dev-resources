import { supabase } from './supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export interface DbResult<T> {
	data: T | null;
	error: PostgrestError | null;
}

export interface QueryOptions {
	orderBy?: string;
	ascending?: boolean;
	limit?: number;
	offset?: number;
}

export class DbService<T extends Record<string, any>> {
	constructor(private tableName: string) {}

	async getAll(options?: QueryOptions): Promise<DbResult<T[]>> {
		let query = supabase.from(this.tableName).select('*');

		if (options?.orderBy) {
			query = query.order(options.orderBy, {
				ascending: options.ascending ?? true
			});
		}

		if (options?.limit) {
			query = query.limit(options.limit);
		}

		if (options?.offset) {
			query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1);
		}

		const { data, error } = await query;
		return { data: data as T[] | null, error };
	}

	async getById(id: string | number): Promise<DbResult<T>> {
		const { data, error } = await supabase.from(this.tableName).select('*').eq('id', id).single();

		return { data: data as T | null, error };
	}

	async getWhere(filters: Partial<T>, options?: QueryOptions): Promise<DbResult<T[]>> {
		let query = supabase.from(this.tableName).select('*');

		Object.entries(filters).forEach(([key, value]) => {
			query = query.eq(key, value);
		});

		if (options?.orderBy) {
			query = query.order(options.orderBy, {
				ascending: options.ascending ?? true
			});
		}

		if (options?.limit) {
			query = query.limit(options.limit);
		}

		const { data, error } = await query;
		return { data: data as T[] | null, error };
	}

	async getByCategory(category: string): Promise<DbResult<T[]>> {
		const { data, error } = await supabase
			.from(this.tableName)
			.select('*')
			.contains('category', [category]);

		return { data: data as T[] | null, error };
	}

	async create(item: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<DbResult<T>> {
		const { data, error } = await supabase.from(this.tableName).insert(item).select().single();

		return { data: data as T | null, error };
	}

	async createMany(items: Omit<T, 'id' | 'created_at' | 'updated_at'>[]): Promise<DbResult<T[]>> {
		const { data, error } = await supabase.from(this.tableName).insert(items).select();

		return { data: data as T[] | null, error };
	}

	async update(
		id: string | number,
		updates: Partial<Omit<T, 'id' | 'created_at'>>
	): Promise<DbResult<T>> {
		const { data, error } = await supabase
			.from(this.tableName)
			.update(updates)
			.eq('id', id)
			.select()
			.single();

		return { data: data as T | null, error };
	}

	async updateWhere(
		filters: Partial<T>,
		updates: Partial<Omit<T, 'id' | 'created_at'>>
	): Promise<DbResult<T[]>> {
		let query = supabase.from(this.tableName).update(updates);

		Object.entries(filters).forEach(([key, value]) => {
			query = query.eq(key, value);
		});

		const { data, error } = await query.select();
		return { data: data as T[] | null, error };
	}

	async delete(id: string | number): Promise<DbResult<T>> {
		const { data, error } = await supabase
			.from(this.tableName)
			.delete()
			.eq('id', id)
			.select()
			.single();

		return { data: data as T | null, error };
	}

	async deleteWhere(filters: Partial<T>): Promise<DbResult<T[]>> {
		let query = supabase.from(this.tableName).delete();

		Object.entries(filters).forEach(([key, value]) => {
			query = query.eq(key, value);
		});

		const { data, error } = await query.select();
		return { data: data as T[] | null, error };
	}

	async count(filters?: Partial<T>): Promise<DbResult<number>> {
		let query = supabase.from(this.tableName).select('*', { count: 'exact', head: true });

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				query = query.eq(key, value);
			});
		}

		const { count, error } = await query;
		return { data: count, error };
	}
}

export function createDbService<T extends Record<string, any>>(tableName: string) {
	return new DbService<T>(tableName);
}
