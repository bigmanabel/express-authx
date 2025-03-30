import Redis from 'ioredis';
import redisConfig from '../config/redis.config';
import { InvalidateRefreshTokenError } from '../errors/invalidate-refresh-token.error';

export class RefreshTokenIdsStorage {
    private redisClient: Redis;

    constructor() {
        this.redisClient = new Redis({
            host: redisConfig.host,
            port: redisConfig.port,
        });
        this.redisClient.on('error', (err) => {
            console.error('Redis Client Error', err);
        });
    }

    async insert(userId: string, tokenId: string): Promise<void> {
        await this.redisClient.set(this.getKey(userId), tokenId);
    }

    async validate(userId: string, tokenId: string): Promise<boolean> {
        const storedId = await this.redisClient.get(this.getKey(userId));
        if (storedId !== tokenId) {
            throw new InvalidateRefreshTokenError();
        }
        return storedId === tokenId;
    }

    async invalidate(userId: string): Promise<void> {
        await this.redisClient.del(this.getKey(userId));
    }

    private getKey(userId: string): string {
        return `user-${userId}`;
    }
}
