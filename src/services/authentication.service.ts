import { randomUUID } from 'crypto';
import { User } from '../models/user.entity';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import jwtConfig from '../config/jwt.config';
import { RefreshTokenIdsStorage } from './refreshTokenIdsStorage';
import { InvalidateRefreshTokenError } from '../errors/invalidate-refresh-token.error';
import { Role } from '../enums/role.enum';

export class AuthenticationService {
    constructor(
        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenStorage: RefreshTokenIdsStorage,
    ) { }

    async signUp(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        const existing = await User.findOne({ email });
        if (existing) {
            throw new Error('User already exists');
        }
        const hashedPassword = await this.bcryptService.hash(password);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: Role.Regular,
            apiKeys: []
        });
        return this.generateTokens(newUser);
    }

    async signIn(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await User.findOne({ email }).select('+password');
        if (!user) throw new Error('User does not exist');
        const valid = await this.bcryptService.compare(password, user.password);
        if (!valid) throw new Error('Password does not match');
        return this.generateTokens(user);
    }

    async generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string }> {
        const refreshTokenId = randomUUID();
        const accessToken = await this.jwtService.sign({
            sub: user._id,
            email: user.email,
            role: user.role,
        }, jwtConfig.accessTokenTtl);
        const refreshToken = await this.jwtService.sign({
            sub: user._id,
            refreshTokenId,
        }, jwtConfig.refreshTokenTtl);

        await this.refreshTokenStorage.insert(user._id.toString(), refreshTokenId);
        return { accessToken, refreshToken };
    }

    async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const decoded = await this.jwtService.verify<{ sub: string; refreshTokenId: string }>(refreshToken);
            const user = await User.findById(decoded.sub);
            if (!user) throw new Error('User not found');

            const isValid = await this.refreshTokenStorage.validate(user._id.toString(), decoded.refreshTokenId);
            if (isValid) {
                await this.refreshTokenStorage.invalidate(user._id.toString());
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
