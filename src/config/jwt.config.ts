import dotenv from 'dotenv';

dotenv.config();

export default {
    secret: process.env.JWT_SECRET as string,
    audience: process.env.JWT_TOKEN_AUDIENCE as string,
    issuer: process.env.JWT_TOKEN_ISSUER as string,
    accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600'),
    refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? '86400'),
};
