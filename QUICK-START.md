# ⚡ Quick Start - Admin Dashboard

## 🚀 En 3 pasos

### 1️⃣ Configura Supabase

Ve a [Supabase Dashboard](https://app.supabase.com/) → SQL Editor y ejecuta:

```sql
-- Copia y pega el contenido de: supabase-setup.sql
```

O simplemente ejecuta esto:

```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  isActive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar acceso (solo para desarrollo)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for development"
ON resources FOR ALL
USING (true) WITH CHECK (true);
```

### 2️⃣ Verifica tu `.env`

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

### 3️⃣ Inicia la app

```bash
pnpm dev
```

## 📍 URLs

- **Página Principal**: http://localhost:5173/
- **Admin Dashboard**: http://localhost:5173/admin-dashboard

## 🎯 Lo que puedes hacer ahora

### En el Dashboard (`/admin-dashboard`):

- ✅ **Crear** recursos con nombre, URL, categoría y descripción
- ✅ **Editar** recursos existentes
- ✅ **Eliminar** recursos
- ✅ **Aprobar** recursos pendientes
- ✅ **Desactivar** recursos activos
- ✅ **Buscar** recursos por nombre, descripción o categoría
- ✅ **Filtrar** por categoría específica
- ✅ **Ver estadísticas** en tiempo real

### En la Página Principal (`/`):

- 📋 Ver todos los recursos activos
- 🔍 Filtrar por categoría
- 🔗 Acceder directamente a los recursos

## 🎨 Ejemplo de Uso Rápido

### 1. Crear un recurso

1. Ve a `/admin-dashboard`
2. Clic en **"➕ Nuevo Recurso"**
3. Completa:
   - **Nombre**: React Documentation
   - **Categoría**: Frontend
   - **URL**: https://react.dev
   - **Descripción**: Documentación oficial de React
   - **Activar**: ✅
4. Clic en **"➕ Crear Recurso"**

### 2. Ver recursos en la página principal

1. Ve a `/`
2. Los recursos activos aparecerán automáticamente
3. Filtra por categoría si deseas

### 3. Aprobar recursos pendientes

1. En el dashboard, clic en **"⏳ Ver Pendientes"**
2. Busca el recurso
3. Clic en **"✓ Aprobar"**

## 🗂️ Categorías Disponibles

- Frontend
- Backend
- Database
- DevOps
- Design
- Tools
- Learning

## 💡 Tips Rápidos

1. **Recursos pendientes**: Crea recursos con el checkbox desactivado para revisarlos antes de publicarlos
2. **Búsqueda rápida**: Usa el buscador para encontrar recursos específicos
3. **Edición rápida**: Haz clic en "✏️ Editar" para modificar cualquier recurso
4. **Vista pública**: La página principal solo muestra recursos con `isActive = true`

## 📚 Documentación Completa

- [ADMIN-DASHBOARD.md](./ADMIN-DASHBOARD.md) - Guía completa del dashboard
- [SUPABASE.md](./SUPABASE.md) - Documentación de Supabase
- [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md) - Resumen técnico

## 🐛 Problemas Comunes

**No se cargan los recursos**

```bash
# Verifica que la tabla existe en Supabase
# Verifica las políticas RLS
# Revisa la consola del navegador para errores
```

**Error al crear/editar**

```bash
# Asegúrate de completar todos los campos requeridos
# Verifica que la URL sea válida
# Revisa las políticas de INSERT/UPDATE en Supabase
```

## 🎉 ¡Listo!

Tu Admin Dashboard está completamente funcional. Solo necesitas:

1. ✅ Ejecutar el SQL en Supabase
2. ✅ Verificar el `.env`
3. ✅ Iniciar con `pnpm dev`

**Empieza en**: http://localhost:5173/admin-dashboard 🚀
