import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EvenementsClient
{
    private readonly base: string;
    private readonly jeton: string;

    constructor(configService: ConfigService)
    {
        this.base = configService.get<string>('GATEWAY_URL', 'http://localhost:3000');
        this.jeton = configService.getOrThrow<string>('INTERNAL_TOKEN');
    }

    async publier(type: string, donnee: unknown): Promise<void>
    {
        try
        {
            await fetch(`${this.base}/evenements`, {
                method: 'POST',
                headers: { 'content-type': 'application/json', 'x-internal-token': this.jeton },
                body: JSON.stringify({ type, donnee }),
            });
        }
        catch (erreur)
        {
        }
    }
}