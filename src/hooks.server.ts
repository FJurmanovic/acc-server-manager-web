import type { ServerInit } from '@sveltejs/kit';
import { redisSessionManager } from '$stores/redisSessionManager';
import type Redis from 'ioredis';

const redisClient: Redis = redisSessionManager['redisClient'];
export const init: ServerInit = async () => {
	console.log(redisClient.status);
	if (redisClient.status == 'connect') return;
	await redisClient.connect();
};
