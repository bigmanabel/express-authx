import config from './env.config';

export default {
  host: config.redis.host,
  port: config.redis.port,
};
