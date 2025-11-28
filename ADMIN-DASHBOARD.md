# 📊 Admin Dashboard - Guía de Uso

El dashboard de administración está disponible en `/admin-dashboard` y te permite gestionar todos los recursos de desarrollo.

## 🚀 Acceso

Visita: `http://localhost:5173/admin-dashboard`

## ✨ Características

### 1. 📊 Panel de Estadísticas
- Visualiza el número de recursos activos
- Recursos pendientes de aprobación
- Total de recursos en el sistema

### 2. ➕ Crear Recursos
1. Haz clic en el botón **"➕ Nuevo Recurso"**
2. Completa el formulario:
   - **Nombre**: Nombre del recurso
   - **Categoría**: Frontend, Backend, Database, DevOps, Design, Tools, Learning
   - **URL**: Enlace al recurso
   - **Descripción**: Información adicional (opcional)
   - **Estado**: Marca la casilla para activar inmediatamente
3. Haz clic en **"➕ Crear Recurso"**

### 3. ✏️ Editar Recursos
1. En la tarjeta del recurso, haz clic en **"✏️ Editar"**
2. El formulario se abrirá con los datos actuales
3. Modifica los campos necesarios
4. Haz clic en **"💾 Guardar Cambios"**

### 4. ✅ Aprobar Recursos
Para recursos marcados como **"⏳ Pendiente"**:
1. Haz clic en el botón **"✓ Aprobar"**
2. El recurso se moverá a la lista de activos

### 5. ⏸ Desactivar Recursos
Para recursos activos:
1. Haz clic en el botón **"⏸ Desactivar"**
2. El recurso se moverá a pendientes

### 6. 🗑️ Eliminar Recursos
1. Haz clic en el botón **"🗑️ Eliminar"**
2. Confirma la acción
3. El recurso se eliminará permanentemente

### 7. 🔍 Buscar y Filtrar
- **Buscador**: Busca por nombre, descripción o categoría
- **Filtro de categoría**: Filtra recursos por categoría específica
- **Ver pendientes**: Muestra solo recursos pendientes de aprobación

### 8. 🔄 Recargar Datos
Haz clic en el botón **"🔄 Recargar"** para actualizar la lista

## 🎯 Flujo de Trabajo Recomendado

### Para Nuevos Recursos
1. Crear recurso con estado **"Pendiente"** (sin activar)
2. Revisar la información
3. Aprobar el recurso cuando esté verificado

### Para Recursos Existentes
1. Buscar el recurso usando el buscador
2. Editar si es necesario
3. Desactivar temporalmente si está en mantenimiento
4. Eliminar solo si ya no es relevante

## 🎨 Estados de Recursos

### ✓ Activo (Verde)
- El recurso está visible y aprobado
- Aparece en las búsquedas públicas

### ⏳ Pendiente (Naranja)
- El recurso está en revisión
- No aparece en búsquedas públicas
- Requiere aprobación manual

## ⌨️ Atajos y Consejos

1. **Búsqueda rápida**: Usa el buscador para encontrar recursos específicos
2. **Filtros combinados**: Combina búsqueda + categoría para resultados precisos
3. **Edición rápida**: El formulario se autocompleta al editar
4. **Mensajes informativos**: Presta atención a los mensajes de éxito/error en la parte superior

## 🔐 Seguridad

> **Importante**: Este dashboard no tiene autenticación por defecto. Para producción, asegúrate de:
> - Implementar autenticación (Supabase Auth)
> - Configurar Row Level Security (RLS) en Supabase
> - Restringir acceso solo a administradores

## 📝 Estructura de la Base de Datos

```sql
-- Tabla: resources
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  isActive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Índices recomendados
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_isActive ON resources(isActive);
CREATE INDEX idx_resources_created_at ON resources(created_at);
```

## 🐛 Solución de Problemas

### No se cargan los recursos
- Verifica que la tabla `resources` existe en Supabase
- Verifica las políticas RLS en Supabase
- Revisa la consola del navegador para errores

### Error al crear/editar
- Verifica que todos los campos requeridos estén completos
- Asegúrate de que la URL sea válida
- Verifica las políticas de INSERT/UPDATE en Supabase

### Error de permisos
- Configura políticas RLS permisivas para desarrollo:
```sql
-- Política permisiva para desarrollo (NO USAR EN PRODUCCIÓN)
CREATE POLICY "Enable all for development"
ON resources
FOR ALL
USING (true)
WITH CHECK (true);
```

## 📚 Archivos Relacionados

- **Componente**: `/src/routes/admin-dashboard/+page.svelte`
- **Servicio**: `/src/lib/services/resources.ts`
- **Tipos**: `/src/lib/types/database.types.ts`
- **Base de datos**: `/src/lib/db.ts`

## 🎓 Próximos Pasos

1. **Agregar Autenticación**: Implementar Supabase Auth
2. **Subir Imágenes**: Permitir logos para cada recurso
3. **Categorías Dinámicas**: Gestionar categorías desde el dashboard
4. **Exportar Datos**: Agregar opción para exportar a CSV/JSON
5. **Historial**: Ver cambios y versiones anteriores
6. **Búsqueda Avanzada**: Filtros por fecha, tags, etc.

