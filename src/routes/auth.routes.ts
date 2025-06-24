import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { SignUpDto, SignInDto, RefreshTokenDto } from '../dto/auth.dto';

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

export default router;
