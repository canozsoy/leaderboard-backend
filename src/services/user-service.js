import userRepository from 'src/repositories/user-repository.js';
import Boom from '@hapi/boom';

class UserService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }

    async signUp(name, country) {
        try {
            const user = await this.userRepo.createUser({
                name,
                country,
            });

            await this.userRepo.createUserRedis(user.id);
            return user;
        } catch (error) {
            if (error.code === 11000) {
                throw Boom.badRequest('USER_EXISTS');
            }
            throw Boom.internal();
        }
    }

    async populate(name, country, score) {
        try {
            const user = await this.userRepo.createUser({ name, country });
            await this.userRepo.populate(user.id, score);
            return user;
        } catch (error) {
            if (error.code === 11000) {
                throw Boom.badRequest('USER_EXISTS');
            }
            throw Boom.internal();
        }
    }
}

export default new UserService(userRepository);
