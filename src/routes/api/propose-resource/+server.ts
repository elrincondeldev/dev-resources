import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

const MAX_PROPOSALS_PER_IP = 5;

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		const clientIP = getClientAddress();

        if (!clientIP) {
            return json({ error: 'No se pudo obtener la dirección IP del cliente' }, { status: 400 });
        }

		const { count, error: countError } = await supabase
			.from('resources')
			.select('*', { count: 'exact', head: true })
			.eq('ip_address', clientIP)
			.eq('isActive', false);

		if (countError) {
			console.error('Error checking proposal count:', countError);
			return json({ error: 'Error al verificar límite de propuestas' }, { status: 500 });
		}

		const proposalCount = count ?? 0;
		if (proposalCount >= MAX_PROPOSALS_PER_IP) {
			return json(
				{
					error: `Has alcanzado el límite de ${MAX_PROPOSALS_PER_IP} propuestas. Por favor espera a que sean revisadas.`
				},
				{ status: 429 }
			);
		}

		const body = await request.json();
		const { name, description, url, category } = body;

		if (!name?.trim() || !url?.trim() || !category || category.length === 0) {
			return json(
				{
					error:
						'Por favor completa todos los campos requeridos (incluyendo al menos una categoría)'
				},
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from('resources')
			.insert({
				name: name.trim(),
				description: description?.trim() || '',
				url: url.trim(),
				category,
				isActive: false,
				ip_address: clientIP
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating resource:', error);
			return json({ error: 'Error al crear el recurso' }, { status: 500 });
		}

		return json({ data, success: true }, { status: 201 });
	} catch (err) {
		console.error('Error in propose-resource:', err);
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};

