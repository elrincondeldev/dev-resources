import { createDbService } from '$lib/db';
import type { Resource } from '$lib/types/database.types';

const resourcesService = createDbService<Resource>('resources');

export const resourcesApi = {
	getAll: (options?: any) => resourcesService.getAll(options),
	getById: (id: string) => resourcesService.getById(id),
	getWhere: (filters: any, options?: any) => resourcesService.getWhere(filters, options),
	create: (item: any) => resourcesService.create(item),
	createMany: (items: any[]) => resourcesService.createMany(items),
	update: (id: string, updates: any) => resourcesService.update(id, updates),
	updateWhere: (filters: any, updates: any) => resourcesService.updateWhere(filters, updates),
	delete: (id: string) => resourcesService.delete(id),
	deleteWhere: (filters: any) => resourcesService.deleteWhere(filters),
	count: (filters?: any) => resourcesService.count(filters),

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
		return await resourcesService.getByCategory(category);
	}
};

export { resourcesService };
