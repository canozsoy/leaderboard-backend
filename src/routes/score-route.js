import scoreController from 'src/controllers/score-controller.js';
import scoreSchemas from 'src/schemas/score-schemas.js';

const scoreRoutes = [
    {
        method: 'GET',
        path: '/user/{userId}/score',
        options: {
            handler: scoreController.getScoreController,
            description: 'Get player leaderboard',
            tags: ['api', 'Score'],
            validate: {
                params: scoreSchemas.getScoreRequestSchema,
            },
            response: {
                schema: scoreSchemas.getScoreResponseSchema,
                failAction: 'log',
            },
        },
    },
    {
        method: 'POST',
        path: '/increase-score',
        options: {
            handler: scoreController.postScoreController,
            description: 'Increase player score',
            tags: ['api', 'Score'],
            validate: {
                payload: scoreSchemas.postScoreRequestSchema,
            },
            response: {
                schema: scoreSchemas.postScoreResponseSchema,
                failAction: 'log',
            },
        },

    },
];

export default scoreRoutes;
