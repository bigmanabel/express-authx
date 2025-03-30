import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '../services/authentication.service';
import { BcryptService } from '../services/bcrypt.service';
import { JwtService } from '../services/jwt.service';
import { RefreshTokenIdsStorage } from '../services/refreshTokenIdsStorage';

const bcryptService = new BcryptService();
const jwtService = new JwtService();
const refreshTokenStorage = new RefreshTokenIdsStorage();
const authService = new AuthenticationService(bcryptService, jwtService, refreshTokenStorage);

export class AuthController {
    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const tokens = await authService.signUp(email, password);
            res.json(tokens);
        } catch (error) {
            next(error);
        }
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const tokens = await authService.signIn(email, password);
            res.json(tokens);
        } catch (error) {
            next(error);
        }
    }

    async refreshTokens(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            const tokens = await authService.refreshTokens(refreshToken);
            res.json(tokens);
        } catch (error) {
            next(error);
        }
    }
}
