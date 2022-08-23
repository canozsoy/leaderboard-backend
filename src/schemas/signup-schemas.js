import Joi from 'joi';

const signupRequestSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .required(),
    country: Joi.string()
        .min(3)
        .max(20)
        .alphanum()
        .required(),
});

const populateRequestSchema = signupRequestSchema.keys({
    score: Joi.number()
        .min(0)
        .max(10000)
        .required(),
});

const signupResponseSchema = Joi.object({
    message: Joi.string().required(),
    code: Joi.number().required(),
});

const populateResponseSchema = signupResponseSchema;

export default {
    signupRequestSchema,
    signupResponseSchema,
    populateRequestSchema,
    populateResponseSchema,
};
