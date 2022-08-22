import 'src/config/index.js';
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import fs from 'fs';
import initializeRoutes from 'src/routes/index.js';
import mongoRepo from 'src/repositories/mongo-repository.js';
import redisRepo from 'src/repositories/redis-repository.js';
import boot from 'src/boot.js';
import { onFailAction, onPreResponse } from 'src/config/server.js';

(async () => {
    await Promise.all([
        mongoRepo.connect(),
        redisRepo.connect(),
    ]);
    const port = process.env.PORT || 3000;
    const server = Hapi.server({
        port,
        host: 'localhost',
        routes: {
            validate: {
                options: {
                    abortEarly: false,
                },
                failAction: onFailAction,
            },
        },
    });

    server.ext('onPreResponse', onPreResponse);

    const { version } = JSON.parse(fs.readFileSync('./package.json'));

    const swaggerOptions = {
        info: {
            title: 'Hapi Structure',
            version,
        },
        schemes: ['http', 'https'],
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions,
        },
    ]);

    await initializeRoutes(server);

    await server.start();
    await boot(server);
    console.log(`Server is running on port ${port}.`);
    console.log(`Api-docs is available on http://127.0.0.1:${port}/documentation`);
})();
