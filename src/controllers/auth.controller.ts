import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '../services/authentication.service';
import { BcryptService } from '../services/bcrypt.service';
import { JwtService } from '../services/jwt.service';
import { RefreshTokenIdsStorage } from '../services/refreshTokenIdsStorage';
import { SignUpDto, SignInDto, RefreshTokenDto } from '../dto/auth.dto';
import logger from '../utils/logger';

export class AuthController {
  private authService: AuthenticationService;

  constructor() {
    const bcryptService = new BcryptService();
    const jwtService = new JwtService();
    const refreshTokenStorage = new RefreshTokenIdsStorage();
    this.authService = new AuthenticationService(bcryptService, jwtService, refreshTokenStorage);
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as SignUpDto;
      logger.info(`Sign up attempt for email: ${email}`);

      const tokens = await this.authService.signUp(email, password);

      logger.info(`User successfully signed up: ${email}`);
      res.status(201).json({
        message: 'User created successfully',
        ...tokens,
      });
    } catch (error) {
      logger.error(`Sign up failed for email: ${req.body.email}`, error);
      next(error);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as SignInDto;
      logger.info(`Sign in attempt for email: ${email}`);

      const tokens = await this.authService.signIn(email, password);

      logger.info(`User successfully signed in: ${email}`);
      res.json({
        message: 'Login successful',
        ...tokens,
      });
    } catch (error) {
      logger.error(`Sign in failed for email: ${req.body.email}`, error);
      next(error);
    }
  }

  async refreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as RefreshTokenDto;
      logger.info('Token refresh attempt');

      const tokens = await this.authService.refreshTokens(refreshToken);

      logger.info('Tokens successfully refreshed');
      res.json({
        message: 'Tokens refreshed successfully',
        ...tokens,
      });
    } catch (error) {
      logger.error('Token refresh failed', error);
      next(error);
    }
  }
}
