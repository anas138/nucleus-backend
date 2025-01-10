import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'local', 'test')
    .required(),
  APP_ENV: Joi.string()
    .valid('dev', 'prod', 'local', 'test', 'stage')
    .required(),
  PORT: Joi.number().default(3000).required(),
  KAFKA_ENABLED: Joi.boolean().required(),
  KAFKA_HOST: Joi.string().required(),
  KAFKA_CONSUMER_GROUP: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required().default(6379),
  RUN_SEED: Joi.boolean().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.number().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().required(),
  DATABASE_LOGGING: Joi.boolean().required(),
  NUCLEUS_LISTENER_ENABLED: Joi.boolean().required(),
  NUCLEUS_APP_ENABLED: Joi.boolean().required(),
  APPLY_ALARM_RULES: Joi.boolean().default(true),
  DELAY_ALARM_ACTIONS: Joi.boolean().required().default(false),
  SEND_EMAIL_NOTIFICATION: Joi.boolean().required().default(true),
  SEND_EMAIL_NOTIFICATION_ON_USER_CREATE: Joi.boolean()
    .required()
    .default(true),
  SESSION_IDLE_TIMEOUT_MINUTES: Joi.number().optional().default(15),
  FILE_SERVER_URL: Joi.string()
    .optional()
    .default('https://dev-bucket.tw1.com'),
})
  .unknown()
  .required();

export function validate(envVar: Record<string, any>): Record<string, any> {
  const { error, value: validatedEnv } = envValidationSchema.validate(envVar, {
    abortEarly: false,
  });
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join('\n');
    console.error(`Invalid environment variables: ${errorMessage}`);
    process.exit(1);
  }
  return validatedEnv;
}
