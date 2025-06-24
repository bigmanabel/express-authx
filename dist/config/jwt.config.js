"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = require("./env.config");
exports.default = {
    secret: env_config_1.config.jwt.secret,
    audience: env_config_1.config.jwt.audience,
    issuer: env_config_1.config.jwt.issuer,
    accessTokenTtl: env_config_1.config.jwt.accessTokenTtl,
    refreshTokenTtl: env_config_1.config.jwt.refreshTokenTtl,
};
