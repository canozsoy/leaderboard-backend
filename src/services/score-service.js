import redisRepository from 'src/repositories/redis-repository.js';
import userRepository from 'src/repositories/user-repository.js';
import Boom from '@hapi/boom';

class ScoreService {
    constructor(redisRepo, userRepo) {
        this.redisRepo = redisRepo;
        this.userRepo = userRepo;
    }

    // eslint-disable-next-line class-methods-use-this
    fillInfo(dataRedisInput, dataMongo, rankOfUser) {
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
        const userInfo = await this.userRepo.findUsersWithIds(ids);
        const filledTopUsers = this.fillInfo(topUsers, userInfo, rankOfUser);
        const filledUsers = this.fillInfo(users, userInfo, rankOfUser);

        return { topUsers: filledTopUsers, users: filledUsers };
    }

    async increaseScore(value, userId) {
        this.redisRepo.increaseScore('user', value, userId);
    }
}

export default new ScoreService(redisRepository, userRepository);
