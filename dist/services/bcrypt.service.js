"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptService = void 0;
const bcryptjs_1 = require("bcryptjs");
class BcryptService {
    async hash(data) {
        const salt = await (0, bcryptjs_1.genSalt)();
        return (0, bcryptjs_1.hash)(data, salt);
    }
    async compare(data, encrypted) {
        return (0, bcryptjs_1.compare)(data, encrypted);
    }
}
exports.BcryptService = BcryptService;
