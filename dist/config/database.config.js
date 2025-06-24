"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("./env.config");
const logger_1 = __importDefault(require("../utils/logger"));
async function connectMongo() {
    try {
        await mongoose_1.default.connect(env_config_1.config.database.uri, {
            // Connection options for better performance and reliability
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
        });
        logger_1.default.info("📦 MongoDB connected successfully");
        // Handle connection events
        mongoose_1.default.connection.on("error", (error) => {
            logger_1.default.error("MongoDB connection error:", error);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            logger_1.default.warn("MongoDB disconnected");
        });
        // Graceful shutdown
        process.on("SIGINT", async () => {
            await mongoose_1.default.connection.close();
            logger_1.default.info("MongoDB connection closed");
            process.exit(0);
        });
    }
    catch (error) {
        logger_1.default.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}
exports.default = mongoose_1.default;
