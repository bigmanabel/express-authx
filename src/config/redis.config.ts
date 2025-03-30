import dotenv from 'dotenv';

dotenv.config();

export default {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
};


