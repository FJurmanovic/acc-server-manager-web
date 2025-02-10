import { IoRedisSessionStore } from '@ethercorps/sveltekit-redis-session';
import Redis from 'ioredis';
import { SECRET, REDIS_URL } from '$env/static/private';

// Now we will create new Instance for RedisSessionStore
const options = {
	redisClient: new Redis(REDIS_URL),
	secret: SECRET
};
// These are the required options to use RedisSessionStore.
export const redisSessionManager = new IoRedisSessionStore(options);
