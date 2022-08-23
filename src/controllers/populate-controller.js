import userService from 'src/services/user-service.js';
import Boom from '@hapi/boom';

export default async function populateController(request) {
    if (process.env.NODE_ENV === 'production') {
        throw Boom.forbidden();
    }
    const { payload } = request;
    const { name, country, score } = payload;
    const user = await userService.populate(name, country, score.toString());
    return user;
}
