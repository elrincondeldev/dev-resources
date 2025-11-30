import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

const MAX_PROPOSALS_PER_IP = 5;

export const GET: RequestHandler = async ({ getClientAddress }) => {
	try {
		const clientIP = getClientAddress();

		console.log(clientIP);

		const { count, error } = await supabase
			.from('resources')
			.select('*', { count: 'exact', head: true })
			.eq('ip_address', clientIP)
			.eq('isActive', false);

		if (error) {
			console.error('Error checking proposal limit:', error);
			return json({ error: 'Error al verificar límite de propuestas' }, { status: 500 });
		}

		const proposalCount = count ?? 0;
		const canPropose = proposalCount < MAX_PROPOSALS_PER_IP;
		const remainingProposals = Math.max(0, MAX_PROPOSALS_PER_IP - proposalCount);

		return json({
			canPropose,
			proposalCount,
			remainingProposals,
			maxProposals: MAX_PROPOSALS_PER_IP
		});
	} catch (err) {
		console.error('Error in check-proposal-limit:', err);
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};

