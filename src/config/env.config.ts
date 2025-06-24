import Joi from "joi";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Environment validation schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().port().default(3000),

  // MongoDB configuration
  MONGO_URI: Joi.string().required(),

  // JWT configuration
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().positive().default(3600), // 1 hour
  JWT_REFRESH_TOKEN_TTL: Joi.number().positive().default(86400), // 24 hours

  // Redis configuration
  REDIS_HOST: Joi.string().default("localhost"),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow("").optional(),

  // API Rate limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().positive().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().positive().default(100),

  // Frontend URL for email links
  FRONTEND_URL: Joi.string().uri().default("http://localhost:3000"),
}).unknown();

// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

export const config = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,

  database: {
    uri: envVars.MONGO_URI,
  },

  jwt: {
    secret: envVars.JWT_SECRET,
    audience: envVars.JWT_TOKEN_AUDIENCE,
    issuer: envVars.JWT_TOKEN_ISSUER,
    accessTokenTtl: envVars.JWT_ACCESS_TOKEN_TTL,
    refreshTokenTtl: envVars.JWT_REFRESH_TOKEN_TTL,
  },

  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASSWORD,
  },

  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
  },

  frontendUrl: envVars.FRONTEND_URL,
};

export default config;
