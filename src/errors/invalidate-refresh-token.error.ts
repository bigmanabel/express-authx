export class InvalidateRefreshTokenError extends Error {
    constructor(message = 'Invalid refresh token') {
        super(message);
    }
}
