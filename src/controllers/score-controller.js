import scoreServiceImport from 'src/services/score-service.js';

function scoreController(scoreService) {
    return {
        async getScoreController(request) {
            const { params } = request;
            const { userId } = params;
            const score = await scoreService.getScore(userId);
            return { score };
        },
        async postScoreController(request) {
            const { payload } = request;
            const { userId, score } = payload;
            await scoreService.increaseScore(String(score), userId);
            return {};
        },
    };
}

export default scoreController(scoreServiceImport);
