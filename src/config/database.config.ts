import { User } from '../models/user.entity';
import { ApiKey } from '../models/api-key.entity';
import dotenv from 'dotenv';
import { dot } from 'node:test/reporters';

dotenv.config();

const config = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, ApiKey],
    synchronize: true
};

export default config;
