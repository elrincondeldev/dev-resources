# ⚡ Inicio Rápido - Supabase

## 🚀 1. Configura tus variables de entorno

Crea o edita el archivo `.env` en la raíz del proyecto:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

## 📝 2. Define tus tipos

Edita `src/lib/types/database.types.ts`:

```typescript
export interface MiTabla {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at: string;
}
```

## 🔧 3. Crea un servicio para tu tabla

```typescript
import { createDbService } from '$lib/db';
import type { MiTabla } from '$lib/types/database.types';

const miTablaDb = createDbService<MiTabla>('mi_tabla');
```

## 💡 4. Usa en tu componente

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { createDbService } from '$lib/db';
  
  const db = createDbService('mi_tabla');
  let items = $state([]);
  
  onMount(async () => {
    const { data } = await db.getAll();
    items = data ?? [];
  });
  
  async function crear(nombre: string) {
    const { data } = await db.create({ nombre });
    if (data) items = [...items, data];
  }
  
  async function eliminar(id: number) {
    await db.delete(id);
    items = items.filter(i => i.id !== id);
  }
</script>

<ul>
  {#each items as item}
    <li>
      {item.nombre}
      <button onclick={() => eliminar(item.id)}>❌</button>
    </li>
  {/each}
</ul>
```

## 📚 Operaciones disponibles

```typescript
// GET
await db.getAll();                          // Todos
await db.getById(id);                       // Por ID
await db.getWhere({ campo: 'valor' });      // Con filtros

// CREATE
await db.create({ campo: 'valor' });        // Uno
await db.createMany([{...}, {...}]);        // Varios

// UPDATE
await db.update(id, { campo: 'nuevo' });    // Por ID
await db.updateWhere({...}, {...});         // Con filtros

// DELETE
await db.delete(id);                        // Por ID
await db.deleteWhere({ campo: 'valor' });   // Con filtros

// COUNT
await db.count();                           // Total
await db.count({ status: 'active' });       // Con filtros
```

## 🎯 Siguiente paso

Ver documentación completa en [`SUPABASE.md`](./SUPABASE.md)

Ver ejemplos de uso en [`src/lib/examples/`](./src/lib/examples/)

Ver componente de ejemplo en [`src/lib/components/SupabaseExample.svelte`](./src/lib/components/SupabaseExample.svelte)

