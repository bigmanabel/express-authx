import { User } from "../models/user.entity";

const fakeUserRepo = new Map<string, User>();

export class UsersService {
    async create(user: User): Promise<User> {
        fakeUserRepo.set(user.id, user);
        return user;
    }

    async findAll(): Promise<User[]> {
        return Array.from(fakeUserRepo.values());
    }

    async findOne(id: string): Promise<User | undefined> {
        return fakeUserRepo.get(id);
    }

    async update(id: string, update: Partial<User>): Promise<User | undefined> {
        const user = fakeUserRepo.get(id);
        if (!user) return undefined;
        const updated = { ...user, ...update };
        fakeUserRepo.set(id, updated);
        return updated;
    }

    async remove(id: string): Promise<void> {
        fakeUserRepo.delete(id);
    }
}
