import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

// Validar que las variables de entorno estén configuradas
const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		'Faltan variables de entorno de Supabase. Asegúrate de configurar PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en tu archivo .env'
	);
}

// Cliente de Supabase para uso en el cliente (navegador)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos helper para las operaciones de base de datos
export type Database = {
	// Aquí puedes definir los tipos de tus tablas
	// Ejemplo:
	// users: {
	//   Row: { id: string; email: string; created_at: string }
	//   Insert: { email: string }
	//   Update: { email?: string }
	// }
};

