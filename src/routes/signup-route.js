import signupController from 'src/controllers/signup-controller.js';
import signupSchemas from 'src/schemas/signup-schemas.js';
import populateController from 'src/controllers/populate-controller.js';

const signupRoutes = [
    {
        method: 'POST',
        path: '/signup',
        options: {
            handler: signupController,
            description: 'Signup',
            tags: ['api', 'Access'],
            validate: {
                payload: signupSchemas.signupRequestSchema,
            },
            response: {
                schema: signupSchemas.signupResponseSchema,
                failAction: 'log',
            },
        },
    },
    {
        method: 'POST',
        path: '/populate',
        options: {
            handler: populateController,
            description: 'Populate',
            tags: ['api', 'Access'],
            validate: {
                payload: signupSchemas.populateRequestSchema,
            },
            response: {
                schema: signupSchemas.populateResponseSchema,
                failAction: 'log',
            },
        },
    },
];

export default signupRoutes;
