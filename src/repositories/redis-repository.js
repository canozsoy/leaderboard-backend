import { createClient } from 'redis';
import redisConfiguration from '../config/redis-config.js';

class RedisRepository {
    constructor(redisConfig) {
        this.redisClient = createClient(redisConfig);

        this.redisClient.on('error', () => {
            console.error('Redis error');
        });
    }

    async connect() {
        this.redisClient.connect();
    }

    async disconnect() {
        this.redisClient.disconnect();
    }

    async setKey(key, value) {
        await this.redisClient.set(key, value);
    }

    async rightPush(list, item) {
        await this.redisClient.rPush(list, item);
    }

    async leftRemove(list, item) {
        await this.redisClient.lRem(list, 1, item);
    }
}

export default new RedisRepository(redisConfiguration);
