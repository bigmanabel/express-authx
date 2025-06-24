"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const user_entity_1 = require("../models/user.entity");
class UsersService {
    async create(userData) {
        // ...existing validation...
        return user_entity_1.User.create(userData);
    }
    async findAll() {
        return user_entity_1.User.find();
    }
    async findOne(id) {
        return user_entity_1.User.findById(id);
    }
    async update(id, update) {
        return user_entity_1.User.findByIdAndUpdate(id, update, { new: true });
    }
    async remove(id) {
        await user_entity_1.User.findByIdAndDelete(id);
    }
}
exports.UsersService = UsersService;
