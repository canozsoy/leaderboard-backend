import redisRepository from 'src/repositories/redis-repository.js';
import weeklyWorkerImport from 'src/worker/weekly-worker.js';

class DailyWorker {
    constructor(weeklyWorker, redisRepo) {
        this.boot = weeklyWorker.boot;
        this.checkProcess = weeklyWorker.checkProcess;
        this.redisRepository = redisRepo;
    }

    async startWorker() {
        await this.redisRepository.copySet('oldUser', 'user');
        console.log('Daily Worker has completed its task!');
    }
}

export default new DailyWorker(weeklyWorkerImport, redisRepository);
