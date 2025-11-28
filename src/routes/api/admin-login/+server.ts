import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const ADMIN_USER = env.ADMIN_USER;
const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { username, password } = await request.json();

		console.log('Credenciales recibidas:', { username, receivedPassword: '***' });
		console.log('Credenciales esperadas:', { user: ADMIN_USER, password: '***' });

		if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
			const sessionToken = `${username}:${password}`;

			cookies.set('admin_session', sessionToken, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7
			});

			return json({ success: true });
		}

		return json({ error: 'Credenciales incorrectas' }, { status: 401 });
	} catch (err) {
		console.error('Error en login:', err);
		return json({ error: 'Error al procesar la solicitud' }, { status: 500 });
	}
};
