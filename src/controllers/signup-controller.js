import userService from '../services/user-service.js';

async function signupController(request) {
    const { payload } = request;
    const { name, country } = payload;
    const user = await userService.signUp(name, country);
    return user;
}

export default signupController;
