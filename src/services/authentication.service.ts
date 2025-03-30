import { randomUUID } from 'crypto';
import { User } from '../models/user.entity';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import jwtConfig from '../config/jwt.config';
import { RefreshTokenIdsStorage } from './refreshTokenIdsStorage';
import { InvalidateRefreshTokenError } from '../errors/invalidate-refresh-token.error';
import { Role } from '../enums/role.enum';

// In a real app, you would use a repository (TypeORM) to access the database.
const fakeUserRepo = new Map<string, User>();

export class AuthenticationService {
    constructor(
        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenStorage: RefreshTokenIdsStorage,
    ) { }

    async signUp(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        if ([...fakeUserRepo.values()].find(u => u.email === email)) {
            throw new Error('User already exists');
        }
        const hashedPassword = await this.bcryptService.hash(password);
        const newUser: User = {
            id: randomUUID(),
            email,
            password: hashedPassword,
            role: Role.Regular,
            apiKeys: []
        };
        fakeUserRepo.set(newUser.id, newUser);
        return this.generateTokens(newUser);
    }

    async signIn(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        const user = [...fakeUserRepo.values()].find(u => u.email === email);
        if (!user) throw new Error('User does not exist');
        const valid = await this.bcryptService.compare(password, user.password);
        if (!valid) throw new Error('Password does not match');
        return this.generateTokens(user);
    }

    async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
        const refreshTokenId = randomUUID();
        const accessToken = await this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        }, jwtConfig.accessTokenTtl);
        const refreshToken = await this.jwtService.sign({
            sub: user.id,
            refreshTokenId,
        }, jwtConfig.refreshTokenTtl);

        await this.refreshTokenStorage.insert(user.id, refreshTokenId);
        return { accessToken, refreshToken };
    }

    async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const decoded = await this.jwtService.verify<{ sub: string; refreshTokenId: string }>(refreshToken);
            const user = fakeUserRepo.get(decoded.sub);
            if (!user) throw new Error('User not found');

            const isValid = await this.refreshTokenStorage.validate(user.id, decoded.refreshTokenId);
            if (isValid) {
                await this.refreshTokenStorage.invalidate(user.id);
                return this.generateTokens(user);
            } else {
                throw new Error('Refresh token is invalid');
            }
        } catch (error) {
            if (error instanceof InvalidateRefreshTokenError) {
                throw new Error('Access denied');
            }
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('An unknown error occurred');
        }
    }
}
