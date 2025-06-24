import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { CreateUserDto, UpdateUserDto, UserParamsDto } from '../dto/user.dto';
import { Role } from '../enums/role.enum';

const router = Router();
const usersController = new UsersController();

// All users routes require authentication
router.use(authMiddleware);

router.post('/', requireRole(Role.Admin), validationMiddleware(CreateUserDto), (req, res, next) =>
  usersController.create(req, res, next)
);

router.get('/', (req, res, next) => usersController.findAll(req, res, next));

router.get('/:id', validationMiddleware(UserParamsDto, 'params'), (req, res, next) =>
  usersController.findOne(req, res, next)
);

router.put(
  '/:id',
  validationMiddleware(UserParamsDto, 'params'),
  validationMiddleware(UpdateUserDto),
  (req, res, next) => usersController.update(req, res, next)
);

router.delete(
  '/:id',
  requireRole(Role.Admin),
  validationMiddleware(UserParamsDto, 'params'),
  (req, res, next) => usersController.remove(req, res, next)
);

export default router;
