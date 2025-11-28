/**
 * Servicio para gestionar recursos
 */

import { createDbService } from '$lib/db';
import type { Resource } from '$lib/types/database.types';

const resourcesService = createDbService<Resource>('resources');

/**
 * API extendida para recursos con funciones específicas
 */
export const resourcesApi = {
	// Métodos CRUD básicos
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

	/**
	 * Obtener todos los recursos activos
	 */
	async getActive() {
		return await resourcesService.getWhere(
			{ isActive: true },
			{ orderBy: 'created_at', ascending: false }
		);
	},

	/**
	 * Obtener recursos pendientes de aprobación
	 */
	async getPending() {
		return await resourcesService.getWhere(
			{ isActive: false },
			{ orderBy: 'created_at', ascending: false }
		);
	},

	/**
	 * Aprobar un recurso
	 */
	async approve(id: string) {
		return await resourcesService.update(id, { isActive: true });
	},

	/**
	 * Rechazar/desactivar un recurso
	 */
	async reject(id: string) {
		return await resourcesService.update(id, { isActive: false });
	},

	/**
	 * Obtener recursos por categoría
	 */
	async getByCategory(category: string, activeOnly = true) {
		const filters = activeOnly ? { category, isActive: true } : { category };
		return await resourcesService.getWhere(
			filters as Partial<Resource>,
			{ orderBy: 'created_at', ascending: false }
		);
	}
};

// También exportar el servicio base por si acaso
export { resourcesService };

