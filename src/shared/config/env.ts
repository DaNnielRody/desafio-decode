import Joi from 'joi';

const envSchema = Joi.object({
  PORT: Joi.number().default(3333),
  JWT_SECRET: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5555),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});

const { error, value: env } = envSchema.validate(process.env, { allowUnknown: true });

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default env;
