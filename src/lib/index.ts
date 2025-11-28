export { supabase } from './supabase';

export { createDbService, DbService } from './db';
export type { DbResult, QueryOptions } from './db';

export type { Resource, CreateResource, UpdateResource } from './types/database.types';

export * from './services';
export * from './services/resources';
