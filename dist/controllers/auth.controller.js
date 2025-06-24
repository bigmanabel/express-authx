"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authentication_service_1 = require("../services/authentication.service");
const bcrypt_service_1 = require("../services/bcrypt.service");
const jwt_service_1 = require("../services/jwt.service");
const refreshTokenIdsStorage_1 = require("../services/refreshTokenIdsStorage");
const bcryptService = new bcrypt_service_1.BcryptService();
const jwtService = new jwt_service_1.JwtService();
const refreshTokenStorage = new refreshTokenIdsStorage_1.RefreshTokenIdsStorage();
const authService = new authentication_service_1.AuthenticationService(bcryptService, jwtService, refreshTokenStorage);
class AuthController {
    async signUp(req, res, next) {
        try {
            const { email, password } = req.body;
            const tokens = await authService.signUp(email, password);
            res.json(tokens);
        }
        catch (error) {
            next(error);
        }
    }
    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            const tokens = await authService.signIn(email, password);
            res.json(tokens);
        }
        catch (error) {
            next(error);
        }
    }
    async refreshTokens(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const tokens = await authService.refreshTokens(refreshToken);
            res.json(tokens);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
