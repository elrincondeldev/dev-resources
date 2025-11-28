import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { Resource, CreateResource } from '../src/lib/types/database.types';

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

interface JsonResource {
	id: string;
	name: string;
	description: string;
	url: string;
	category: string | string[];
	isActive: boolean;
	created_at?: string;
}

async function importResources(filePath: string, options: ImportOptions = {}) {
	const { clearExisting = false, skipDuplicates = true } = options;

	console.log('📦 Iniciando importación de recursos...\n');

	try {
		const fullPath = resolve(process.cwd(), filePath);
		console.log(`📄 Leyendo archivo: ${fullPath}`);
		const fileContent = readFileSync(fullPath, 'utf-8');
		const jsonResources: JsonResource[] = JSON.parse(fileContent);

		const resources: Resource[] = jsonResources.map((r) => ({
			...r,
			category: Array.isArray(r.category) ? r.category : [r.category]
		}));

		console.log(`✅ Archivo leído correctamente: ${resources.length} recursos encontrados\n`);

		if (clearExisting) {
			console.log('🗑️  Eliminando recursos existentes...');
			const { error: deleteError } = await supabase.from('resources').delete().gte('id', '0');

			if (deleteError) {
				console.error('❌ Error al limpiar la tabla:', deleteError.message);
				process.exit(1);
			}
			console.log('✅ Tabla limpiada correctamente\n');
		}

		let imported = 0;
		let skipped = 0;
		let errors = 0;

		for (const resource of resources) {
			const { id, created_at, ...resourceData } = resource;

			try {
				if (skipDuplicates) {
					const { data: existing } = await supabase
						.from('resources')
						.select('id')
						.eq('url', resource.url)
						.single();

					if (existing) {
						console.log(`⏭️  Saltando recurso duplicado: ${resource.name}`);
						skipped++;
						continue;
					}
				}

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

const args = process.argv.slice(2);
const filePath = args[0] || 'learning-resources.json';
const clearExisting = args.includes('--clear');
const allowDuplicates = args.includes('--allow-duplicates');

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

importResources(filePath, {
	clearExisting,
	skipDuplicates: !allowDuplicates
});
