import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { Resource, CreateResource } from '../src/lib/types/database.types';

// Configurar Supabase
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	console.error('❌ Error: Variables de entorno no configuradas');
	console.error('Asegúrate de tener PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en tu .env');
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ImportOptions {
	clearExisting?: boolean;
	skipDuplicates?: boolean;
}

async function importResources(filePath: string, options: ImportOptions = {}) {
	const { clearExisting = false, skipDuplicates = true } = options;

	console.log('📦 Iniciando importación de recursos...\n');

	try {
		// Leer el archivo JSON
		const fullPath = resolve(process.cwd(), filePath);
		console.log(`📄 Leyendo archivo: ${fullPath}`);
		const fileContent = readFileSync(fullPath, 'utf-8');
		const resources: Resource[] = JSON.parse(fileContent);

		console.log(`✅ Archivo leído correctamente: ${resources.length} recursos encontrados\n`);

		// Limpiar tabla si se solicita
		if (clearExisting) {
			console.log('🗑️  Eliminando recursos existentes...');
			const { error: deleteError } = await supabase.from('resources').delete().neq('id', '');

			if (deleteError) {
				console.error('❌ Error al limpiar la tabla:', deleteError.message);
				process.exit(1);
			}
			console.log('✅ Tabla limpiada correctamente\n');
		}

		// Importar recursos
		let imported = 0;
		let skipped = 0;
		let errors = 0;

		for (const resource of resources) {
			// Preparar el recurso (quitar created_at si está presente, Supabase lo genera)
			const { created_at, ...resourceData } = resource;

			try {
				if (skipDuplicates) {
					// Verificar si ya existe un recurso con ese ID o URL
					const { data: existing } = await supabase
						.from('resources')
						.select('id')
						.or(`id.eq.${resource.id},url.eq.${resource.url}`)
						.single();

					if (existing) {
						console.log(`⏭️  Saltando recurso duplicado: ${resource.name}`);
						skipped++;
						continue;
					}
				}

				// Insertar el recurso
				const { error } = await supabase.from('resources').insert(resourceData);

				if (error) {
					console.error(`❌ Error al importar "${resource.name}":`, error.message);
					errors++;
				} else {
					console.log(`✅ Importado: ${resource.name}`);
					imported++;
				}
			} catch (err: any) {
				console.error(`❌ Error inesperado con "${resource.name}":`, err.message);
				errors++;
			}
		}

		// Resumen
		console.log('\n📊 Resumen de importación:');
		console.log(`   ✅ Importados: ${imported}`);
		console.log(`   ⏭️  Saltados: ${skipped}`);
		console.log(`   ❌ Errores: ${errors}`);
		console.log(`   📦 Total: ${resources.length}\n`);

		if (imported > 0) {
			console.log('🎉 Importación completada exitosamente!');
		}
	} catch (error: any) {
		console.error('❌ Error durante la importación:', error.message);
		process.exit(1);
	}
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);
const filePath = args[0] || 'learning-resources.json';
const clearExisting = args.includes('--clear');
const allowDuplicates = args.includes('--allow-duplicates');

// Mostrar ayuda
if (args.includes('--help') || args.includes('-h')) {
	console.log(`
📦 Script de importación de recursos a Supabase

Uso:
  pnpm import [archivo] [opciones]

Argumentos:
  archivo                Ruta al archivo JSON (default: learning-resources.json)

Opciones:
  --clear               Elimina todos los recursos existentes antes de importar
  --allow-duplicates    Permite importar recursos duplicados (por ID o URL)
  --help, -h            Muestra esta ayuda

Ejemplos:
  pnpm import
  pnpm import learning-resources.json
  pnpm import resources.json --clear
  pnpm import --clear --allow-duplicates
	`);
	process.exit(0);
}

// Ejecutar importación
importResources(filePath, {
	clearExisting,
	skipDuplicates: !allowDuplicates
});

