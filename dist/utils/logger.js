"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, errors, json, colorize, simple } = winston_1.default.format;
// Create logger instance
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: 'express-authx' },
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: combine(timestamp(), errors({ stack: true }), json()),
        }),
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston_1.default.transports.File({
            filename: 'logs/combined.log',
            format: combine(timestamp(), errors({ stack: true }), json()),
        }),
    ],
});
// If we're not in production, log to the console with colorized simple format
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: combine(colorize(), simple()),
    }));
}
exports.default = logger;
