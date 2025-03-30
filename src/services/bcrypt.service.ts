import { genSalt, hash, compare } from 'bcryptjs';

export class BcryptService {
    async hash(data: string): Promise<string> {
        const salt = await genSalt();
        return hash(data, salt);
    }

    async compare(data: string, encrypted: string): Promise<boolean> {
        return compare(data, encrypted);
    }
}
