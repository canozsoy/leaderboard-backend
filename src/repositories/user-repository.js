import UserModel from 'src/models/user-model.js';
import RedisRepository from 'src/repositories/redis-repository.js';

class UserRepository {
    constructor(userModel, redisRepo) {
        this.UserModel = userModel;
        this.redisRepo = redisRepo;
    }

    async getUser(whereObject) {
        return this.UserModel.find(whereObject);
    }

    async createUser(setObject) {
        return this.UserModel.create(setObject);
    }

    async createUserRedis(id) {
        this.redisRepo.setAdd('user', '0', id);
    }

    async populate(id, rank) {
        this.redisRepo.setAdd('user', rank, id);
    }

    async findUsersWithIds(ids) {
        return this.UserModel.find({ _id: { $in: ids } });
    }
}

export default new UserRepository(UserModel, RedisRepository);
