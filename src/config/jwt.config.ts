import config from './env.config';

export default {
  secret: config.jwt.secret,
  audience: config.jwt.audience,
  issuer: config.jwt.issuer,
  accessTokenTtl: config.jwt.accessTokenTtl,
  refreshTokenTtl: config.jwt.refreshTokenTtl,
};
