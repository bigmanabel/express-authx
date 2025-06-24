"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = require("./env.config");
exports.default = {
    host: env_config_1.config.redis.host,
    port: env_config_1.config.redis.port,
};
