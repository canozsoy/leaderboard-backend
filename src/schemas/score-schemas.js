import Joi from 'joi';

const getScoreRequestSchema = Joi.object({
    userId: Joi.string()
        .min(5)
        .alphanum()
        .required(),
});

const postScoreRequestSchema = getScoreRequestSchema.keys({
    score: Joi.number()
        .min(0)
        .required(),
});

const postScoreResponseSchema = Joi.object({
    message: Joi.string().required(),
    code: Joi.number().required(),
});

const getScoreResponseSchema = postScoreResponseSchema;

export default {
    getScoreResponseSchema,
    getScoreRequestSchema,
    postScoreRequestSchema,
    postScoreResponseSchema,
};
