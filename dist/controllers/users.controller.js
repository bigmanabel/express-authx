"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const users_service_1 = require("../services/users.service");
const usersService = new users_service_1.UsersService();
class UsersController {
    async create(req, res, next) {
        try {
            // In a real app, validate with express-validator
            const user = req.body;
            const created = await usersService.create(user);
            res.status(201).json(created);
        }
        catch (error) {
            next(error);
        }
    }
    async findAll(req, res, next) {
        try {
            const users = await usersService.findAll();
            res.json(users);
        }
        catch (error) {
            next(error);
        }
    }
    async findOne(req, res, next) {
        try {
            const id = req.params.id;
            const user = await usersService.findOne(id);
            if (!user)
                return res.status(404).json({ message: 'User not found' });
            res.json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const id = req.params.id;
            const update = req.body;
            const updated = await usersService.update(id, update);
            if (!updated)
                return res.status(404).json({ message: 'User not found' });
            res.json(updated);
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            const id = req.params.id;
            await usersService.remove(id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UsersController = UsersController;
