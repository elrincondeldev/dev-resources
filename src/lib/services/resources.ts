import { createDbService, type QueryOptions } from '$lib/db';
import type { Resource } from '$lib/types/database.types';

const resourcesService = createDbService<Omit<Resource, 'id' | 'created_at' | 'updated_at'>>('resources');

export const resourcesApi = {
	getAll: (options?: QueryOptions) => resourcesService.getAll(options),
	getById: (id: string) => resourcesService.getById(id),
	getWhere: (filters: Partial<Resource>, options?: QueryOptions) => resourcesService.getWhere(filters, options),
	create: (item: Omit<Resource, 'id' | 'created_at' | 'updated_at'>) => resourcesService.create(item),
	createMany: (items: Omit<Resource, 'id' | 'created_at' | 'updated_at'>[]) => resourcesService.createMany(items),
	update: (id: string, updates: Partial<Resource>) => resourcesService.update(id, updates),
	updateWhere: (filters: Partial<Resource>, updates: Partial<Resource>) => resourcesService.updateWhere(filters, updates),
	delete: (id: string) => resourcesService.delete(id),
	deleteWhere: (filters: Partial<Resource>) => resourcesService.deleteWhere(filters),
	count: (filters?: Partial<Resource>) => resourcesService.count(filters),

	async getActive() {
		return await resourcesService.getWhere(
			{ isActive: true },
			{ orderBy: 'created_at', ascending: false }
		);
	},

	async getPending() {
		return await resourcesService.getWhere(
			{ isActive: false },
			{ orderBy: 'created_at', ascending: false }
		);
	},

	async approve(id: string) {
		return await resourcesService.update(id, { isActive: true });
	},

	async reject(id: string) {
		return await resourcesService.update(id, { isActive: false });
	},

	async getByCategory(category: string, activeOnly = true) {
		return await resourcesService.getByCategory(category, activeOnly);
	}
};

export { resourcesService };
