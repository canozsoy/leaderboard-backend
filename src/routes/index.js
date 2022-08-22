import signupRoute from 'src/routes/signup-route.js';

export default async function initializeRoutes(hapiServer) {
    const routes = [
        ...signupRoute,
    ];

    await hapiServer.register({
        name: 'Routes',
        register: (server) => {
            server.route(routes);
        },
    }, {
        routes: {
            prefix: '/api/v1',
        },
    });
}
