import { v4 as uuid } from 'uuid';
import nodeCron from 'node-cron';
import redisRepo from 'src/repositories/redis-repository.js';
import mongoRepo from 'src/repositories/mongo-repository.js';

const closeApplicationOnSignal = (server) => async (signal) => {
    // Should close all the connections here
    await redisRepo.leftRemove('process', global.config.processId);
    await Promise.all([
        redisRepo.disconnect(),
        mongoRepo.disconnect(),
        server.stop(),
    ]);
    process.kill(process.pid, signal);
};

async function boot(server) {
    // Register process
    const uniqueId = uuid();
    global.config = { processId: uniqueId };
    await redisRepo.rightPush('process', uniqueId);
    nodeCron.schedule('59 23 * * 0', () => {

    });
    process.once('SIGINT', closeApplicationOnSignal(server));
    process.once('SIGTERM', closeApplicationOnSignal(server));
    process.on('uncaughtException', (error) => {
        console.error(error);
    });
    process.on('unhandledRejection', (error) => {
        console.error(error);
    });
}

export default boot;
