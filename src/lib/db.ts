import { supabase } from "./supabase";
import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Resultado genérico de operaciones de base de datos
 */
export interface DbResult<T> {
  data: T | null;
  error: PostgrestError | null;
}

/**
 * Opciones para consultas
 */
export interface QueryOptions {
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Servicio genérico para operaciones CRUD en cualquier tabla
 */
export class DbService<T extends Record<string, any>> {
  constructor(private tableName: string) {}

  /**
   * GET - Obtener todos los registros de una tabla
   * @param options - Opciones de ordenamiento, límite, etc.
   */
  async getAll(options?: QueryOptions): Promise<DbResult<T[]>> {
    let query = supabase.from(this.tableName).select("*");

    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.ascending ?? true,
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit ?? 10) - 1
      );
    }

    const { data, error } = await query;
    return { data: data as T[] | null, error };
  }

  /**
   * GET - Obtener un registro por ID
   * @param id - ID del registro
   */
  async getById(id: string | number): Promise<DbResult<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    return { data: data as T | null, error };
  }

  /**
   * GET - Buscar registros con filtros personalizados
   * @param filters - Objeto con los filtros a aplicar
   * @param options - Opciones de ordenamiento, límite, etc.
   */
  async getWhere(
    filters: Partial<T>,
    options?: QueryOptions
  ): Promise<DbResult<T[]>> {
    let query = supabase.from(this.tableName).select("*");

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    // Aplicar opciones
    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.ascending ?? true,
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
      .select("*")
      .eq("category", category);

    return { data: data as T[] | null, error };
  }

  /**
   * CREATE - Insertar un nuevo registro
   * @param item - Datos del registro a crear
   */
  async create(
    item: Omit<T, "id" | "created_at" | "updated_at">
  ): Promise<DbResult<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(item)
      .select()
      .single();

    return { data: data as T | null, error };
  }

  /**
   * CREATE - Insertar múltiples registros
   * @param items - Array de registros a crear
   */
  async createMany(
    items: Omit<T, "id" | "created_at" | "updated_at">[]
  ): Promise<DbResult<T[]>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(items)
      .select();

    return { data: data as T[] | null, error };
  }

  /**
   * UPDATE - Actualizar un registro por ID
   * @param id - ID del registro a actualizar
   * @param updates - Datos a actualizar
   */
  async update(
    id: string | number,
    updates: Partial<Omit<T, "id" | "created_at">>
  ): Promise<DbResult<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data: data as T | null, error };
  }

  /**
   * UPDATE - Actualizar múltiples registros con filtros
   * @param filters - Filtros para seleccionar registros
   * @param updates - Datos a actualizar
   */
  async updateWhere(
    filters: Partial<T>,
    updates: Partial<Omit<T, "id" | "created_at">>
  ): Promise<DbResult<T[]>> {
    let query = supabase.from(this.tableName).update(updates);

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query.select();
    return { data: data as T[] | null, error };
  }

  /**
   * DELETE - Eliminar un registro por ID
   * @param id - ID del registro a eliminar
   */
  async delete(id: string | number): Promise<DbResult<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .select()
      .single();

    return { data: data as T | null, error };
  }

  /**
   * DELETE - Eliminar múltiples registros con filtros
   * @param filters - Filtros para seleccionar registros a eliminar
   */
  async deleteWhere(filters: Partial<T>): Promise<DbResult<T[]>> {
    let query = supabase.from(this.tableName).delete();

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query.select();
    return { data: data as T[] | null, error };
  }

  /**
   * Contar registros en la tabla
   * @param filters - Filtros opcionales
   */
  async count(filters?: Partial<T>): Promise<DbResult<number>> {
    let query = supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { count, error } = await query;
    return { data: count, error };
  }
}

/**
 * Factory para crear servicios de base de datos
 * @param tableName - Nombre de la tabla
 * @returns Instancia de DbService para la tabla
 */
export function createDbService<T extends Record<string, any>>(
  tableName: string
) {
  return new DbService<T>(tableName);
}
