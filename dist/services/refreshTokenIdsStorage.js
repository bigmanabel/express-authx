"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenIdsStorage = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis_config_1 = __importDefault(require("../config/redis.config"));
const invalidate_refresh_token_error_1 = require("../errors/invalidate-refresh-token.error");
class RefreshTokenIdsStorage {
    constructor() {
        this.redisClient = new ioredis_1.default({
            host: redis_config_1.default.host,
            port: redis_config_1.default.port,
        });
        this.redisClient.on('error', (err) => {
            console.error('Redis Client Error', err);
        });
    }
    async insert(userId, tokenId) {
        await this.redisClient.set(this.getKey(userId), tokenId);
    }
    async validate(userId, tokenId) {
        const storedId = await this.redisClient.get(this.getKey(userId));
        if (storedId !== tokenId) {
            throw new invalidate_refresh_token_error_1.InvalidateRefreshTokenError();
        }
        return storedId === tokenId;
    }
    async invalidate(userId) {
        await this.redisClient.del(this.getKey(userId));
    }
    getKey(userId) {
        return `user-${userId}`;
    }
}
exports.RefreshTokenIdsStorage = RefreshTokenIdsStorage;
