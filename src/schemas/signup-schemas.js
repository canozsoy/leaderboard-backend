import Joi from 'joi';

const signupRequestSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .alphanum()
        .required(),
    country: Joi.string()
        .min(3)
        .max(20)
        .alphanum()
        .required(),
});

const signupResponseSchema = Joi.object({
    message: Joi.string().required(),
    code: Joi.number().required(),
});

export {
    signupRequestSchema,
    signupResponseSchema,
};
