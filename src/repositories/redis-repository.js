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
        this.redisClient.set(key, value);
    }

    async rightPush(list, item) {
        this.redisClient.rPush(list, item);
    }

    async leftRemove(list, item) {
        this.redisClient.lRem(list, 1, item);
    }

    async setAdd(setName, rank, payload) {
        this.redisClient.sendCommand(['ZADD', setName, rank, payload]);
    }

    async increaseScore(setName, value, id) {
        this.redisClient.sendCommand(['ZINCRBY', setName, value, id]);
    }

    async getRank(setName, member) {
        return this.redisClient.sendCommand(['ZREVRANK', setName, member]);
    }

    // eslint-disable-next-line class-methods-use-this
    formatRawData(rawData, start) {
        const formattedArray = Array(rawData.length / 2).fill(undefined);
        for (let i = 0, n = formattedArray.length; i < n; i += 1) {
            formattedArray[i] = {
                id: rawData[i * 2],
                score: rawData[i * 2 + 1],
                rank: i + start,
            };
        }
        return formattedArray;
    }

    async getRange(setName, start, end) {
        const rawData = await this.redisClient.sendCommand(['ZREVRANGE', setName, start, end, 'WITHSCORES']);
        return this.formatRawData(rawData, Number(start));
    }
}

export default new RedisRepository(redisConfiguration);
