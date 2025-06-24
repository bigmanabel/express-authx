"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const crypto_1 = require("crypto");
const user_entity_1 = require("../models/user.entity");
const jwt_config_1 = __importDefault(require("../config/jwt.config"));
const invalidate_refresh_token_error_1 = require("../errors/invalidate-refresh-token.error");
const role_enum_1 = require("../enums/role.enum");
class AuthenticationService {
    constructor(bcryptService, jwtService, refreshTokenStorage) {
        this.bcryptService = bcryptService;
        this.jwtService = jwtService;
        this.refreshTokenStorage = refreshTokenStorage;
    }
    async signUp(email, password) {
        const existing = await user_entity_1.User.findOne({ email });
        if (existing) {
            throw new Error('User already exists');
        }
        const hashedPassword = await this.bcryptService.hash(password);
        const newUser = await user_entity_1.User.create({
            email,
            password: hashedPassword,
            role: role_enum_1.Role.Regular,
            apiKeys: []
        });
        return this.generateTokens(newUser);
    }
    async signIn(email, password) {
        const user = await user_entity_1.User.findOne({ email }).select('+password');
        if (!user)
            throw new Error('User does not exist');
        const valid = await this.bcryptService.compare(password, user.password);
        if (!valid)
            throw new Error('Password does not match');
        return this.generateTokens(user);
    }
    async generateTokens(user) {
        const refreshTokenId = (0, crypto_1.randomUUID)();
        const accessToken = await this.jwtService.sign({
            sub: user._id,
            email: user.email,
            role: user.role,
        }, jwt_config_1.default.accessTokenTtl);
        const refreshToken = await this.jwtService.sign({
            sub: user._id,
            refreshTokenId,
        }, jwt_config_1.default.refreshTokenTtl);
        await this.refreshTokenStorage.insert(user._id.toString(), refreshTokenId);
        return { accessToken, refreshToken };
    }
    async refreshTokens(refreshToken) {
        try {
            const decoded = await this.jwtService.verify(refreshToken);
            const user = await user_entity_1.User.findById(decoded.sub);
            if (!user)
                throw new Error('User not found');
            const isValid = await this.refreshTokenStorage.validate(user._id.toString(), decoded.refreshTokenId);
            if (isValid) {
                await this.refreshTokenStorage.invalidate(user._id.toString());
                return this.generateTokens(user);
            }
            else {
                throw new Error('Refresh token is invalid');
            }
        }
        catch (error) {
            if (error instanceof invalidate_refresh_token_error_1.InvalidateRefreshTokenError) {
                throw new Error('Access denied');
            }
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('An unknown error occurred');
        }
    }
}
exports.AuthenticationService = AuthenticationService;
