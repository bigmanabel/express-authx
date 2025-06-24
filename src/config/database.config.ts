import { DataSource } from 'typeorm';
import { User } from '../models/user.entity';
import { ApiKey } from '../models/api-key.entity';
import config from './env.config';

export const dataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  entities: [User, ApiKey],
  synchronize: config.nodeEnv === 'development', // Only sync in development
  logging: config.nodeEnv === 'development',
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default dataSource;
