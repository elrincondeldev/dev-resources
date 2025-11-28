// place files you want to import through the `$lib` alias in this folder.

// Exportar cliente de Supabase
export { supabase } from './supabase';

// Exportar funciones y tipos de base de datos
export { createDbService, DbService } from './db';
export type { DbResult, QueryOptions } from './db';

// Exportar tipos de base de datos
export type { Resource, CreateResource, UpdateResource } from './types/database.types';

// Exportar servicios predefinidos
export * from './services';
export * from './services/resources';
