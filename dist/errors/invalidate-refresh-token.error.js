"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidateRefreshTokenError = void 0;
class InvalidateRefreshTokenError extends Error {
    constructor(message = 'Invalid refresh token') {
        super(message);
    }
}
exports.InvalidateRefreshTokenError = InvalidateRefreshTokenError;
