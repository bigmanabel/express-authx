"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorMiddleware;
const boom_1 = __importDefault(require("@hapi/boom"));
const logger_1 = __importDefault(require("../utils/logger"));
const env_config_1 = require("../config/env.config");
function errorMiddleware(err, req, res, _next) {
    // Log the error
    logger_1.default.error("Error occurred:", {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
    });
    // Handle Boom errors
    if (err.isBoom) {
        return res.status(err.output.statusCode).json({
            error: err.output.payload.error,
            message: err.output.payload.message,
            statusCode: err.output.statusCode,
            ...(err.data && { details: err.data }),
        });
    }
    // Handle validation errors
    if (err.name === "ValidationError") {
        const boomError = boom_1.default.badRequest("Validation failed", err.details);
        return res.status(boomError.output.statusCode).json({
            error: boomError.output.payload.error,
            message: boomError.output.payload.message,
            statusCode: boomError.output.statusCode,
            details: err.details,
        });
    }
    // Handle MongoDB errors
    if (err.name === "MongoError" || err.name === "MongoServerError") {
        const boomError = boom_1.default.badRequest("Database operation failed");
        return res.status(boomError.output.statusCode).json({
            error: boomError.output.payload.error,
            message: env_config_1.config.nodeEnv === "production"
                ? "Database operation failed"
                : err.message,
            statusCode: boomError.output.statusCode,
        });
    }
    // Handle Mongoose validation errors
    if (err.name === "ValidationError" && err.errors) {
        const boomError = boom_1.default.badRequest("Validation failed");
        return res.status(boomError.output.statusCode).json({
            error: boomError.output.payload.error,
            message: "Validation failed",
            statusCode: boomError.output.statusCode,
            details: Object.values(err.errors).map((e) => e.message),
        });
    }
    // Handle JWT errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        const boomError = boom_1.default.unauthorized("Invalid or expired token");
        return res.status(boomError.output.statusCode).json({
            error: boomError.output.payload.error,
            message: boomError.output.payload.message,
            statusCode: boomError.output.statusCode,
        });
    }
    // Default error handling
    const boomError = boom_1.default.badImplementation("Internal server error");
    res.status(boomError.output.statusCode).json({
        error: boomError.output.payload.error,
        message: env_config_1.config.nodeEnv === "production"
            ? "Something went wrong on our end"
            : err.message,
        statusCode: boomError.output.statusCode,
        ...(env_config_1.config.nodeEnv !== "production" && { stack: err.stack }),
    });
}
