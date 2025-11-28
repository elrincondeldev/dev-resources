import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const ADMIN_USER = env.ADMIN_USER;
const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

export const load: PageServerLoad = async ({ cookies, url }) => {
	const sessionToken = cookies.get('admin_session');

	if (sessionToken === `${ADMIN_USER}:${ADMIN_PASSWORD}`) {
		return { authenticated: true };
	}

	throw redirect(303, `/admin-login?redirect=${encodeURIComponent(url.pathname)}`);
};
