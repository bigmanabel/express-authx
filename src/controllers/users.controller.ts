import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { User } from '../models/user.entity';

const usersService = new UsersService();

export class UsersController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            // In a real app, validate with express-validator
            const user = req.body;
            const created = await usersService.create(user);
            res.status(201).json(created);
        } catch (error) {
            next(error);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await usersService.findAll();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const user = await usersService.findOne(id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const update = req.body;
            const updated = await usersService.update(id, update);
            if (!updated) return res.status(404).json({ message: 'User not found' });
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            await usersService.remove(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
