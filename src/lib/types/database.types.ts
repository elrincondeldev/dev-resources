export interface Resource {
	id: string;
	name: string;
	description: string;
	url: string;
	category: string[];
	created_at: string;
	isActive: boolean;
}

export type CreateResource = Omit<Resource, 'id' | 'created_at'>;
export type UpdateResource = Partial<Omit<Resource, 'id' | 'created_at'>>;
