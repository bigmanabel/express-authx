import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/sign-up', (req, res, next) => authController.signUp(req, res, next));
router.post('/sign-in', (req, res, next) => authController.signIn(req, res, next));
router.post('/refresh-tokens', (req, res, next) => authController.refreshTokens(req, res, next));

export default router;
