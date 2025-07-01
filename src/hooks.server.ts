import type { Handle } from '@sveltejs/kit';
import { redisSessionManager } from '$stores/redisSessionManager';
import { env } from '$env/dynamic/private';
import type Redis from 'ioredis';

const USER_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

interface SessionData {
	token?: string;
	user?: any;
	userFetchedAt?: number;
}

export const handle: Handle = async ({ event, resolve }) => {
	// Ensure redis is connected
	const redisClient: Redis = redisSessionManager['redisClient'];
	if (redisClient.status !== 'connect' && redisClient.status !== 'ready') {
		try {
			await redisClient.connect();
		} catch (err) {
			console.error('Redis connection failed', err);
		}
	}

	// Get session from cookie
	const session = await redisSessionManager.getSession(event.cookies);
	const sessionData: SessionData = session?.data || {};

	if (!sessionData.token) {
		event.locals.user = null;
		return resolve(event);
	}

	// Check if cached user data is still valid
	if (sessionData.user && sessionData.userFetchedAt) {
		const isExpired = Date.now() - sessionData.userFetchedAt > USER_CACHE_DURATION;
		if (!isExpired) {
			event.locals.user = sessionData.user;
			return resolve(event);
		}
	}

	// Fetch fresh user data
	try {
		const response = await fetch(`${env.API_BASE_URL}/auth/me`, {
			headers: {
				Authorization: `Bearer ${sessionData.token}`
			}
		});

		if (response.ok) {
			const user = await response.json();
			event.locals.user = user;

			// Cache user data in session
			sessionData.user = user;
			sessionData.userFetchedAt = Date.now();
			await redisSessionManager.createSession(event.cookies, sessionData, user.id);
		} else {
			// Token invalid, clear session
			event.locals.user = null;
			await redisSessionManager.deleteCookie(event.cookies);
		}
	} catch (error) {
		console.error('Failed to fetch user:', error);
		event.locals.user = null;
	}

	return resolve(event);
};
