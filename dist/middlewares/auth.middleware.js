"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
const boom_1 = __importDefault(require("@hapi/boom"));
const jwt_service_1 = require("../services/jwt.service");
const jwtService = new jwt_service_1.JwtService();
async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw boom_1.default.unauthorized("Access token is required");
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        try {
            const payload = await jwtService.verify(token);
            req.user = payload;
            next();
        }
        catch (error) {
            throw boom_1.default.unauthorized("Invalid or expired token");
        }
    }
    catch (error) {
        next(error);
    }
}
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            return next(boom_1.default.unauthorized("Authentication required"));
        }
        if (req.user.role !== role) {
            return next(boom_1.default.forbidden("Insufficient permissions"));
        }
        next();
    };
}
