import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StocksClient
{
    private readonly base: string;
    private readonly jeton: string;

    constructor(configService: ConfigService)
    {
        this.base = configService.getOrThrow<string>('STOCKS_URL');
        this.jeton = configService.getOrThrow<string>('INTERNAL_TOKEN');
    }

    async decrementer(produitId: string, magasinId: string, quantite: number): Promise<void>
    {
        await this.appeler('decrementer', produitId, magasinId, quantite);
    }

    async incrementer(produitId: string, magasinId: string, quantite: number): Promise<void>
    {
        await this.appeler('incrementer', produitId, magasinId, quantite);
    }

    private async appeler(action: string, produitId: string, magasinId: string, quantite: number): Promise<void>
    {
        const reponse = await fetch(`${this.base}/stocks/${action}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-internal-token': this.jeton },
            body: JSON.stringify({ produitId, magasinId, quantite }),
        });
        if (!reponse.ok)
        {
            throw new ConflictException('Stock insuffisant');
        }
    }
}