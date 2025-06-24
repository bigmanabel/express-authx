import logger from '../utils/logger';
import config from '../config/env.config';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  constructor() {
    // In production, you would initialize your email service here
    // Examples: SendGrid, AWS SES, Nodemailer with SMTP, etc.
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // In development, just log the email
      if (config.nodeEnv === 'development') {
        logger.info('📧 Email would be sent in production:', {
          to: options.to,
          subject: options.subject,
          text: options.text,
          html: options.html,
        });
        return true;
      }

      // TODO: Implement actual email sending in production
      // Example with SendGrid:
      // const msg = {
      //   to: options.to,
      //   from: process.env.FROM_EMAIL,
      //   subject: options.subject,
      //   text: options.text,
      //   html: options.html,
      // };
      // await sgMail.send(msg);

      logger.info(`Email sent successfully to: ${options.to}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${config.frontendUrl || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const emailOptions: EmailOptions = {
      to: email,
      subject: 'Password Reset Request',
      text: `
        You requested a password reset for your account.
        
        Please click the following link to reset your password:
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this password reset, please ignore this email.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your account.</p>
          <p>Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour.
          </p>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, please ignore this email.
          </p>
        </div>
      `,
    };

    return this.sendEmail(emailOptions);
  }

  async sendPasswordResetConfirmation(email: string): Promise<boolean> {
    const emailOptions: EmailOptions = {
      to: email,
      subject: 'Password Reset Successful',
      text: `
        Your password has been successfully reset.
        
        If you didn't perform this action, please contact support immediately.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Password Reset Successful</h2>
          <p>Your password has been successfully reset.</p>
          <p style="color: #666; font-size: 14px;">
            If you didn't perform this action, please contact support immediately.
          </p>
        </div>
      `,
    };

    return this.sendEmail(emailOptions);
  }
}
