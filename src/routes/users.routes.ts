import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';

const router = Router();
const usersController = new UsersController();

router.post('/', (req, res, next) => usersController.create(req, res, next));
router.get('/', (req, res, next) => usersController.findAll(req, res, next));
router.get('/:id', (req, res, next) => usersController.findOne(req, res, next));
router.put('/:id', (req, res, next) => usersController.update(req, res, next));
router.delete('/:id', (req, res, next) => usersController.remove(req, res, next));

export default router;