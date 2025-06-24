import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '../services/authentication.service';
import { BcryptService } from '../services/bcrypt.service';
import { JwtService } from '../services/jwt.service';
import { RefreshTokenIdsStorage } from '../services/refreshTokenIdsStorage';
import { PasswordResetService } from '../services/password-reset.service';
import { EmailService } from '../services/email.service';
import {
  SignUpDto,
  SignInDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from '../dto/auth.dto';
import logger from '../utils/logger';

export class AuthController {
  private authService: AuthenticationService;
  private passwordResetService: PasswordResetService;
  private emailService: EmailService;

  constructor() {
    const bcryptService = new BcryptService();
    const jwtService = new JwtService();
    const refreshTokenStorage = new RefreshTokenIdsStorage();
    this.authService = new AuthenticationService(bcryptService, jwtService, refreshTokenStorage);
    this.passwordResetService = new PasswordResetService(bcryptService);
    this.emailService = new EmailService();
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

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body as ForgotPasswordDto;
      logger.info(`Forgot password request for email: ${email}`);

      const resetToken = await this.passwordResetService.createResetToken(email);

      if (resetToken) {
        await this.emailService.sendPasswordResetEmail(email, resetToken);
      }

      // Always return success to prevent email enumeration
      res.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });

      logger.info(`Forgot password process completed for email: ${email}`);
    } catch (error) {
      logger.error(`Forgot password failed for email: ${req.body.email}`, error);
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body as ResetPasswordDto;
      const { email } = req.query as { email: string };

      if (!email) {
        return res.status(400).json({
          error: 'Email is required',
        });
      }

      logger.info(`Password reset attempt for email: ${email}`);

      const isValidToken = await this.passwordResetService.validateResetToken(token, email);
      if (!isValidToken) {
        return res.status(400).json({
          error: 'Invalid or expired reset token',
        });
      }

      const success = await this.passwordResetService.resetPassword(token, email, newPassword);
      if (!success) {
        return res.status(400).json({
          error: 'Failed to reset password',
        });
      }

      await this.emailService.sendPasswordResetConfirmation(email);

      res.json({
        message: 'Password has been reset successfully',
      });

      logger.info(`Password successfully reset for email: ${email}`);
    } catch (error) {
      logger.error('Password reset failed', error);
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body as UpdatePasswordDto;
      const userId = req.user?.sub;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication required',
        });
      }

      logger.info(`Password update attempt for user: ${userId}`);

      const success = await this.passwordResetService.updatePassword(
        userId,
        currentPassword,
        newPassword
      );

      if (!success) {
        return res.status(400).json({
          error: 'Failed to update password',
        });
      }

      res.json({
        message: 'Password updated successfully',
      });

      logger.info(`Password successfully updated for user: ${userId}`);
    } catch (error) {
      if (error instanceof Error && error.message === 'Current password is incorrect') {
        return res.status(400).json({
          error: 'Current password is incorrect',
        });
      }
      logger.error('Password update failed', error);
      next(error);
    }
  }
}
