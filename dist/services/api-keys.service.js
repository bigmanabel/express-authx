"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeysService = void 0;
const crypto_1 = require("crypto");
class ApiKeysService {
    constructor(bcryptService) {
        this.bcryptService = bcryptService;
    }
    async createAndHash(id) {
        const apiKey = this.generateApiKey(id);
        const hashedKey = await this.bcryptService.hash(apiKey);
        return { apiKey, hashedKey };
    }
    async validate(apiKey, hashedKey) {
        return this.bcryptService.compare(apiKey, hashedKey);
    }
    extractIdFromApiKey(apiKey) {
        const [id] = Buffer.from(apiKey, 'base64').toString('ascii').split(' ');
        return id;
    }
    generateApiKey(id) {
        const apiKey = `${id} ${(0, crypto_1.randomUUID)()}`;
        return Buffer.from(apiKey).toString('base64');
    }
}
exports.ApiKeysService = ApiKeysService;
