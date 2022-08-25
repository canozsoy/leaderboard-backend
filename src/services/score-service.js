import redisRepository from 'src/repositories/redis-repository.js';
import userRepository from 'src/repositories/user-repository.js';
import Boom from '@hapi/boom';

class ScoreService {
    constructor(redisRepo, userRepo) {
        this.redisRepo = redisRepo;
        this.userRepo = userRepo;
    }

    // eslint-disable-next-line class-methods-use-this
    fillInfo(dataRedisInput, dataMongo, rankOfUser, oldRanks) {
        const dataRedis = dataRedisInput;
        for (let i = 0, n = dataRedis.length; i < n; i += 1) {
            if (dataRedis[i].rank === rankOfUser) {
                dataRedis[i].currentUser = true;
            }
            for (let j = 0, m = dataMongo.length; j < m; j += 1) {
                if (dataRedis[i].id === dataMongo[j].id) {
                    dataRedis[i] = {
                        ...dataRedis[i],
                        country: dataMongo[j].country,
                        name: dataMongo[j].name,
                        money: dataMongo[j].money,
                        oldRank: oldRanks[dataRedis[i].id],
                    };
                }
            }
        }
        return dataRedis;
    }

    async getScore(userId) {
        const [rankOfUser, topUsers] = await Promise.all([
            this.redisRepo.getRank('user', userId),
            this.redisRepo.getRange('user', '0', '99'),
        ]);

        if (!rankOfUser && rankOfUser !== 0) {
            throw Boom.notFound();
        }

        const lowerRank = rankOfUser - 3;
        const upperRank = rankOfUser + 2;
        const users = await this.redisRepo.getRange('user', `${lowerRank}`, `${upperRank}`);
        const topUserIds = topUsers.map((topUser) => topUser.id);
        const userIds = users.map((user) => user.id);
        const ids = [...topUserIds, ...userIds];
        const [oldRanks, userInfo] = await Promise.all([
            this.getOldRanks(ids),
            this.userRepo.findUsersWithIds(ids),
        ]);
        const filledTopUsers = this.fillInfo(topUsers, userInfo, rankOfUser, oldRanks);
        const filledUsers = this.fillInfo(users, userInfo, rankOfUser, oldRanks);

        return { topUsers: filledTopUsers, users: filledUsers };
    }

    async increaseScore(value, userId) {
        await this.redisRepo.increaseScore('user', value, userId);
    }

    async getOldRanks(ids) {
        const oldRanksAsPromises = ids.map((id) => this.redisRepo.getRank('oldUser', id));
        const oldRanks = await Promise.all(oldRanksAsPromises);
        return ids.reduce((prev, current, index) => ({ ...prev, [current]: oldRanks[index] }), {});
    }
}

export default new ScoreService(redisRepository, userRepository);
