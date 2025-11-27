# 🚀 Guía de Supabase

Esta guía te muestra cómo usar Supabase en tu aplicación SvelteKit.

## 📋 Configuración

### Variables de Entorno

Asegúrate de tener estas variables en tu archivo `.env`:

```env
PUBLIC_SUPABASE_URL=tu-url-de-supabase
PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

## 🛠️ Uso Básico

### 1. Define el tipo de tu tabla

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}
```

### 2. Crea un servicio para tu tabla

```typescript
import { createDbService } from '$lib/db';

const usersDb = createDbService<User>('users');
```

### 3. Usa las operaciones CRUD

## 📖 Operaciones CRUD

### GET - Obtener todos los registros

```typescript
// Obtener todos los usuarios
const { data, error } = await usersDb.getAll();

// Con opciones
const { data, error } = await usersDb.getAll({
  orderBy: 'created_at',
  ascending: false,
  limit: 10,
  offset: 0
});
```

### GET - Obtener un registro por ID

```typescript
const { data, error } = await usersDb.getById('user-id-123');
```

### GET - Buscar con filtros

```typescript
// Buscar por email
const { data, error } = await usersDb.getWhere({ 
  email: 'usuario@ejemplo.com' 
});

// Con múltiples filtros y opciones
const { data, error } = await usersDb.getWhere(
  { status: 'active', role: 'admin' },
  { orderBy: 'name', ascending: true, limit: 20 }
);
```

### CREATE - Crear un registro

```typescript
const { data, error } = await usersDb.create({
  email: 'nuevo@ejemplo.com',
  name: 'Usuario Nuevo'
});
```

### CREATE - Crear múltiples registros

```typescript
const { data, error } = await usersDb.createMany([
  { email: 'user1@ejemplo.com', name: 'Usuario 1' },
  { email: 'user2@ejemplo.com', name: 'Usuario 2' },
  { email: 'user3@ejemplo.com', name: 'Usuario 3' }
]);
```

### UPDATE - Actualizar un registro

```typescript
const { data, error } = await usersDb.update('user-id-123', {
  name: 'Nombre Actualizado'
});
```

### UPDATE - Actualizar múltiples registros

```typescript
const { data, error } = await usersDb.updateWhere(
  { status: 'pending' },  // Filtro
  { status: 'active' }    // Actualización
);
```

### DELETE - Eliminar un registro

```typescript
const { data, error } = await usersDb.delete('user-id-123');
```

### DELETE - Eliminar múltiples registros

```typescript
const { data, error } = await usersDb.deleteWhere({ 
  status: 'inactive' 
});
```

### COUNT - Contar registros

```typescript
// Contar todos
const { data: count, error } = await usersDb.count();

// Contar con filtros
const { data: count, error } = await usersDb.count({ 
  status: 'active' 
});
```

## 🎨 Ejemplo en un Componente Svelte

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { createDbService } from '$lib/db';
  
  interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
  }
  
  const usersDb = createDbService<User>('users');
  
  let users = $state<User[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  
  // Cargar usuarios al montar el componente
  onMount(async () => {
    const result = await usersDb.getAll({
      orderBy: 'created_at',
      ascending: false
    });
    
    if (result.error) {
      error = result.error.message;
    } else {
      users = result.data ?? [];
    }
    
    loading = false;
  });
  
  // Crear un nuevo usuario
  async function handleCreate() {
    const result = await usersDb.create({
      email: 'nuevo@ejemplo.com',
      name: 'Usuario Nuevo'
    });
    
    if (result.error) {
      alert('Error: ' + result.error.message);
      return;
    }
    
    if (result.data) {
      users = [result.data, ...users];
    }
  }
  
  // Actualizar un usuario
  async function handleUpdate(userId: string, newName: string) {
    const result = await usersDb.update(userId, { name: newName });
    
    if (result.error) {
      alert('Error: ' + result.error.message);
      return;
    }
    
    if (result.data) {
      users = users.map(u => 
        u.id === userId ? result.data! : u
      );
    }
  }
  
  // Eliminar un usuario
  async function handleDelete(userId: string) {
    if (!confirm('¿Estás seguro?')) return;
    
    const result = await usersDb.delete(userId);
    
    if (result.error) {
      alert('Error: ' + result.error.message);
      return;
    }
    
    users = users.filter(u => u.id !== userId);
  }
</script>

{#if loading}
  <p>Cargando...</p>
{:else if error}
  <div class="error">Error: {error}</div>
{:else}
  <div>
    <button onclick={handleCreate}>Crear Usuario</button>
    
    <ul>
      {#each users as user (user.id)}
        <li>
          <span>{user.name} - {user.email}</span>
          <button onclick={() => handleUpdate(user.id, 'Nuevo Nombre')}>
            Actualizar
          </button>
          <button onclick={() => handleDelete(user.id)}>
            Eliminar
          </button>
        </li>
      {/each}
    </ul>
  </div>
{/if}
```

## 🔄 Ejemplo en Server Load (+page.server.ts)

```typescript
import { createDbService } from '$lib/db';
import type { PageServerLoad } from './$types';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

const usersDb = createDbService<User>('users');

export const load: PageServerLoad = async () => {
  const { data: users, error } = await usersDb.getAll({
    orderBy: 'created_at',
    ascending: false,
    limit: 50
  });
  
  return {
    users: users ?? [],
    error: error?.message
  };
};
```

## 🎯 Consejos y Buenas Prácticas

### 1. Manejo de Errores

Siempre verifica si hay errores:

```typescript
const { data, error } = await usersDb.getAll();

if (error) {
  console.error('Error:', error.message);
  // Manejar el error apropiadamente
  return;
}

// Usar los datos
console.log(data);
```

### 2. Tipos de TypeScript

Define interfaces claras para tus tablas:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at?: string;
}
```

### 3. Reutiliza los Servicios

Crea un archivo central para tus servicios:

```typescript
// $lib/services.ts
import { createDbService } from '$lib/db';

export const usersDb = createDbService<User>('users');
export const postsDb = createDbService<Post>('posts');
export const commentsDb = createDbService<Comment>('comments');
```

### 4. Paginación

```typescript
const page = 1;
const pageSize = 20;

const { data, error } = await usersDb.getAll({
  limit: pageSize,
  offset: (page - 1) * pageSize,
  orderBy: 'created_at',
  ascending: false
});
```

### 5. Queries Complejas

Para queries más complejas, usa el cliente de Supabase directamente:

```typescript
import { supabase } from '$lib/supabase';

const { data, error } = await supabase
  .from('users')
  .select(`
    *,
    posts (
      id,
      title,
      created_at
    )
  `)
  .eq('status', 'active')
  .gte('created_at', '2024-01-01')
  .order('created_at', { ascending: false });
```

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [API Reference de Supabase JS](https://supabase.com/docs/reference/javascript)
- [Guía de SvelteKit](https://kit.svelte.dev/docs)

## 🆘 Solución de Problemas

### Error: "Faltan variables de entorno de Supabase"

Asegúrate de que tu archivo `.env` existe y contiene:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

### Error: "Table 'X' does not exist"

Verifica que:
1. La tabla existe en tu base de datos de Supabase
2. El nombre de la tabla es correcto (case-sensitive)
3. Tienes los permisos adecuados configurados en Supabase

### Error: "Row Level Security policy violation"

Configura las políticas RLS en Supabase Dashboard:
1. Ve a Authentication > Policies
2. Crea políticas para SELECT, INSERT, UPDATE, DELETE según necesites
3. Ejemplo de política permisiva para desarrollo:
   ```sql
   CREATE POLICY "Enable all access for authenticated users"
   ON users
   FOR ALL
   USING (auth.role() = 'authenticated');
   ```

## 🔐 Seguridad

Para operaciones sensibles o que requieran privilegios elevados, considera usar el Service Role Key en el servidor:

```typescript
// Solo en el servidor (*.server.ts)
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SERVICE_ROLE_KEY
);
```

**⚠️ NUNCA expongas el Service Role Key al cliente (navegador).**

