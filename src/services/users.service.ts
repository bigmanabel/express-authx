import { User } from "../models/user.entity";

export class UsersService {
    async create(userData: any): Promise<any> {
        // ...existing validation...
        return User.create(userData);
    }

    async findAll(): Promise<any[]> {
        return User.find();
    }

    async findOne(id: string): Promise<any | null> {
        return User.findById(id);
    }

    async update(id: string, update: any): Promise<any | null> {
        return User.findByIdAndUpdate(id, update, { new: true });
    }

    async remove(id: string): Promise<void> {
        await User.findByIdAndDelete(id);
    }
}
