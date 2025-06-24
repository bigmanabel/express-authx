import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  SignUpDto,
  SignInDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from '../dto/auth.dto';

const router = Router();
const authController = new AuthController();

router.post('/sign-up', validationMiddleware(SignUpDto), (req, res, next) =>
  authController.signUp(req, res, next)
);

router.post('/sign-in', validationMiddleware(SignInDto), (req, res, next) =>
  authController.signIn(req, res, next)
);

router.post('/refresh-tokens', validationMiddleware(RefreshTokenDto), (req, res, next) =>
  authController.refreshTokens(req, res, next)
);

router.post('/forgot-password', validationMiddleware(ForgotPasswordDto), (req, res, next) =>
  authController.forgotPassword(req, res, next)
);

router.post('/reset-password', validationMiddleware(ResetPasswordDto), (req, res, next) =>
  authController.resetPassword(req, res, next)
);

router.put(
  '/update-password',
  authMiddleware,
  validationMiddleware(UpdatePasswordDto),
  (req, res, next) => authController.updatePassword(req, res, next)
);

export default router;
