import Boom from '@hapi/boom';

function onFailAction(req, h, error) {
    if (process.env.NODE_ENV !== 'prod') {
        throw error;
    }
    throw Boom.badRequest('Invalid request payload input');
}

function onPreResponse(request) {
    const { response } = request;

    if (response.isBoom) {
        response.output.payload.status = 'FAIL';
    } else {
        response.source.status = 'SUCCESS';
        response.source.statusCode = response.statusCode || 200;
    }

    return response;
}

export {
    onFailAction,
    onPreResponse,
};
