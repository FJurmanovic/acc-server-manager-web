import { checkAuth } from '$api/authService';
import { getServers, restartService, startService, stopService } from '$api/serverService';
import { fail, redirect, type Actions, type RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	const isAuth = await checkAuth(event);
	if (!isAuth) return redirect(308, '/login');
	const servers = await getServers(event);
	return { servers };
};

// Helper function to create a server action with validation and error handling
const createServerAction = (
	action: (event: RequestEvent, id: number) => Promise<void>,
	{ success, failure }: { success: string; failure: string }
) => {
	return async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { message: 'Invalid server ID provided.' });
		}

		const serverId = Number(id);
		if (isNaN(serverId)) {
			return fail(400, { message: 'Server ID must be a number.' });
		}

		try {
			await action(event, serverId);
			return { success: true, message: success };
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			return fail(500, { message: `${failure}: ${message}` });
		}
	};
};

export const actions = {
	start: createServerAction(startService, {
		success: 'Server started successfully.',
		failure: 'Failed to start server'
	}),
	restart: createServerAction(restartService, {
		success: 'Server restarted successfully.',
		failure: 'Failed to restart server'
	}),
	stop: createServerAction(stopService, {
		success: 'Server stopped successfully.',
		failure: 'Failed to stop server'
	})
} satisfies Actions;
