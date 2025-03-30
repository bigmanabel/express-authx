import { randomUUID } from 'crypto';
import { BcryptService } from './bcrypt.service';
import { GeneratedApiKeyPayload } from '../interfaces/generated-api-key-payload.interface';

export class ApiKeysService {
    constructor(private readonly bcryptService: BcryptService) { }

    async createAndHash(id: string): Promise<GeneratedApiKeyPayload> {
        const apiKey = this.generateApiKey(id);
        const hashedKey = await this.bcryptService.hash(apiKey);
        return { apiKey, hashedKey };
    }

    async validate(apiKey: string, hashedKey: string): Promise<boolean> {
        return this.bcryptService.compare(apiKey, hashedKey);
    }

    extractIdFromApiKey(apiKey: string): string {
        const [id] = Buffer.from(apiKey, 'base64').toString('ascii').split(' ');
        return id;
    }

    private generateApiKey(id: string): string {
        const apiKey = `${id} ${randomUUID()}`;
        return Buffer.from(apiKey).toString('base64');
    }
}
