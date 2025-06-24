"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Environment validation schema
const envSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string()
        .valid("development", "production", "test")
        .default("development"),
    PORT: joi_1.default.number().port().default(3000),
    // MongoDB configuration
    MONGO_URI: joi_1.default.string().required(),
    // JWT configuration
    JWT_SECRET: joi_1.default.string().min(32).required(),
    JWT_TOKEN_AUDIENCE: joi_1.default.string().required(),
    JWT_TOKEN_ISSUER: joi_1.default.string().required(),
    JWT_ACCESS_TOKEN_TTL: joi_1.default.number().positive().default(3600), // 1 hour
    JWT_REFRESH_TOKEN_TTL: joi_1.default.number().positive().default(86400), // 24 hours
    // Redis configuration
    REDIS_HOST: joi_1.default.string().default("localhost"),
    REDIS_PORT: joi_1.default.number().port().default(6379),
    REDIS_PASSWORD: joi_1.default.string().allow("").optional(),
    // API Rate limiting
    RATE_LIMIT_WINDOW_MS: joi_1.default.number().positive().default(900000), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: joi_1.default.number().positive().default(100),
    // Frontend URL for email links
    FRONTEND_URL: joi_1.default.string().uri().default("http://localhost:3000"),
}).unknown();
// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
}
exports.config = {
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
exports.default = exports.config;
