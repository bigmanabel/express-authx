"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = __importDefault(require("../config/jwt.config"));
class JwtService {
    sign(payload, expiresIn) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.sign(payload, jwt_config_1.default.secret, {
                audience: jwt_config_1.default.audience,
                issuer: jwt_config_1.default.issuer,
                expiresIn,
            }, (err, token) => {
                if (err || !token) {
                    return reject(err);
                }
                resolve(token);
            });
        });
    }
    verify(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, jwt_config_1.default.secret, {
                audience: jwt_config_1.default.audience,
                issuer: jwt_config_1.default.issuer,
            }, (err, decoded) => {
                if (err)
                    return reject(err);
                resolve(decoded);
            });
        });
    }
}
exports.JwtService = JwtService;
