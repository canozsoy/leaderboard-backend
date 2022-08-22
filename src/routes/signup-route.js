import signupController from 'src/controllers/signup-controller.js';
import { signupRequestSchema, signupResponseSchema } from 'src/schemas/signup-schemas.js';

const loginRoutes = [{
    method: 'POST',
    path: '/signup',
    options: {
        handler: signupController,
        description: 'Signup',
        tags: ['api', 'Access'],
        validate: {
            payload: signupRequestSchema,
        },
        response: {
            schema: signupResponseSchema,
            failAction: 'log',
        },
    },
}];

export default loginRoutes;
