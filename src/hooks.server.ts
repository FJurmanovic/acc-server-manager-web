import type { Handle } from '@sveltejs/kit';
import { redisSessionManager } from '$stores/redisSessionManager';
import { env } from '$env/dynamic/private';
import type Redis from 'ioredis';

export const handle: Handle = async ({ event, resolve }) => {
	// Ensure redis is connected
	const redisClient: Redis = redisSessionManager['redisClient'];
	if (redisClient.status !== 'connect' && redisClient.status !== 'ready') {
		try {
			await redisClient.connect();
		} catch (err) {
			console.error('Redis connection failed', err);
			// We can still continue without a user session, but log the error.
		}
	}

	// Get session from cookie
	const session = await redisSessionManager.getSession(event.cookies);

	if (session && session.data && session.data.token) {
		try {
			// Fetch user data from /api/me
			const response = await fetch(`${env.API_BASE_URL}/auth/me`, {
				headers: {
					Authorization: `Bearer ${session.data.token}`
				}
			});

			if (response.ok) {
				const user = await response.json();
				event.locals.user = user;
			} else {
				console.log(await response.text(), response.status);
				// Token might be invalid/expired, clear it
				event.locals.user = null;
				await redisSessionManager.deleteCookie(event.cookies);
			}
		} catch (error) {
			console.error('Failed to fetch user:', error);
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
