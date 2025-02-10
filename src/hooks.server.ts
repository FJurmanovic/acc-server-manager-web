import type { ServerInit } from '@sveltejs/kit';
import { redisSessionManager } from '$stores/redisSessionManager';

export const init: ServerInit = async () => {
	await redisSessionManager['redisClient'].connect();
};
