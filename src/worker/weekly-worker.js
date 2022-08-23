import redisRepository from 'src/repositories/redis-repository.js';
import userRepository from 'src/repositories/user-repository.js';

class WeeklyWorker {
    constructor(redisRepo, userRepo) {
        this.redisRepository = redisRepo;
        this.userRepo = userRepo;
    }

    async boot() {
        await this.checkProcess();
    }

    async checkProcess() {
        const worker = await this.redisRepository.getListElement('process', 0);
        if (global.config.processId === worker) {
            await this.startWorker();
        }
    }

    async startWorker() {
        const prize = await this.computePrize();
        await Promise.all([
            this.distributePrize(prize),
            this.resetLeaderBoard(),
        ]);
        console.log('Weekly Worker has completed its task!');
    }

    async computePrize() {
        const numberOfItems = await this.redisRepository.getElementNumberInSet('user');
        let sum = 0;
        const chunkSize = 1000;
        for (let i = 0, n = numberOfItems; i < n; i += chunkSize) {
            // eslint-disable-next-line no-await-in-loop
            const users = await this.redisRepository.getRange('user', `${i}`, `${i + chunkSize - 1}`);
            sum += users.reduce((prev, current) => prev + Number(current.score), 0);
        }
        sum *= 0.02;
        const prize = await this.redisRepository.getKey('prize');
        if (!prize && prize !== 0) {
            await this.redisRepository.setKey('prize', sum);
            return sum;
        }

        const totalPrize = sum + Number(prize);
        await this.redisRepository.setKey('prize', totalPrize);
        return totalPrize;
    }

    async distributePrize(prize) {
        const firstPlacePrize = prize * 0.20;
        const secondPlacePrize = prize * 0.15;
        const thirdPlacePrize = prize * 0.10;
        const restPrize = (prize * 0.55) / 97;
        const topUsers = await this.redisRepository.getRange('user', '0', '99');
        const [first, second, third, ...restUser] = topUsers;
        const restIds = restUser.map((user) => user.id);
        await Promise.all([
            this.userRepo.increaseMoney([first.id], firstPlacePrize),
            this.userRepo.increaseMoney([second.id], secondPlacePrize),
            this.userRepo.increaseMoney([third.id], thirdPlacePrize),
            this.userRepo.increaseMoney(restIds, restPrize),
        ]);
    }

    async resetLeaderBoard() {
        await this.redisRepository.copySetWithZeros('zeroUser', 'user');
        await this.redisRepository.renameSet('zeroUser', 'user');
    }
}

export default new WeeklyWorker(redisRepository, userRepository);
