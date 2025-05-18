import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireLogin } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
	const user = requireLogin();
	return { user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		const res = await event.fetch('/api/logout');
		if (res.status !== 200) {
			const body = await res.json();
			return fail(400, { message: body.message });
		}
		event.locals.user = null;
		event.locals.session = null;

		return redirect(302, '/login');
	},
};
