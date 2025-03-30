import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import { AppController } from '../controllers/app.controller';

const router = Router();
const appController = new AppController();

router.get('/', (req, res) => {
    res.send(appController.getHello());
});
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

export default router;
