import { IoRedisSessionStore } from '@ethercorps/sveltekit-redis-session';
import Redis from 'ioredis';
import { env } from '$env/dynamic/private';

// Now we will create new Instance for RedisSessionStore
const options = {
	redisClient: new Redis(env.REDIS_URL, { lazyConnect: true }),
	secret: env.SECRET
};
// These are the required options to use RedisSessionStore.
export const redisSessionManager = new IoRedisSessionStore(options);
