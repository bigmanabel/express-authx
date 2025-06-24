import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { PasswordResetToken } from '../models/password-reset-token.entity';
import { User } from '../models/user.entity';
import { dataSource } from '../config/database.config';
import { BcryptService } from './bcrypt.service';
import logger from '../utils/logger';

export class PasswordResetService {
  private passwordResetTokenRepository: Repository<PasswordResetToken>;
  private userRepository: Repository<User>;

  constructor(private readonly bcryptService: BcryptService) {
    this.passwordResetTokenRepository = dataSource.getRepository(PasswordResetToken);
    this.userRepository = dataSource.getRepository(User);
  }

  async createResetToken(email: string): Promise<string> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists or not for security
      logger.warn(`Password reset attempt for non-existent email: ${email}`);
      return ''; // Return empty string but don't throw error
    }

    // Generate secure random token
    const token = randomBytes(32).toString('hex');
    const hashedToken = await this.bcryptService.hash(token);

    // Set expiration time (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Invalidate any existing reset tokens for this user
    await this.passwordResetTokenRepository.update(
      { user: { id: user.id }, used: false },
      { used: true }
    );

    // Create new reset token
    const resetToken = this.passwordResetTokenRepository.create({
      token: hashedToken,
      email,
      user,
      expiresAt,
      used: false,
    });

    await this.passwordResetTokenRepository.save(resetToken);

    logger.info(`Password reset token created for user: ${email}`);
    return token; // Return unhashed token for email
  }

  async validateResetToken(token: string, email: string): Promise<boolean> {
    const resetTokens = await this.passwordResetTokenRepository.find({
      where: {
        email,
        used: false,
      },
      relations: ['user'],
    });

    for (const resetToken of resetTokens) {
      // Check if token hasn't expired
      if (resetToken.expiresAt < new Date()) {
        continue;
      }

      // Verify token
      const isValidToken = await this.bcryptService.compare(token, resetToken.token);
      if (isValidToken) {
        return true;
      }
    }

    return false;
  }

  async resetPassword(token: string, email: string, newPassword: string): Promise<boolean> {
    const resetTokens = await this.passwordResetTokenRepository.find({
      where: {
        email,
        used: false,
      },
      relations: ['user'],
    });

    for (const resetToken of resetTokens) {
      // Check if token hasn't expired
      if (resetToken.expiresAt < new Date()) {
        continue;
      }

      // Verify token
      const isValidToken = await this.bcryptService.compare(token, resetToken.token);
      if (isValidToken) {
        // Hash new password
        const hashedPassword = await this.bcryptService.hash(newPassword);

        // Update user password
        await this.userRepository.update({ id: resetToken.user.id }, { password: hashedPassword });

        // Mark token as used
        await this.passwordResetTokenRepository.update({ id: resetToken.id }, { used: true });

        logger.info(`Password successfully reset for user: ${email}`);
        return true;
      }
    }

    logger.warn(`Invalid password reset attempt for email: ${email}`);
    return false;
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    // Get user with password
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.bcryptService.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await this.bcryptService.hash(newPassword);

    // Update password
    await this.userRepository.update({ id: userId }, { password: hashedNewPassword });

    logger.info(`Password updated for user: ${user.email}`);
    return true;
  }

  // Cleanup expired tokens (can be called by a cron job)
  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.passwordResetTokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now })
      .execute();

    logger.info('Expired password reset tokens cleaned up');
  }
}
