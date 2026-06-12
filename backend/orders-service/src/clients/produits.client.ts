import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ProduitDistant
{
    prix: number;
    magasinId: string;
    nom: string;
}

@Injectable()
export class ProduitsClient
{
    private readonly base: string;

    constructor(configService: ConfigService)
    {
        this.base = configService.getOrThrow<string>('PRODUCTS_URL');
    }

    async recupererProduit(id: string): Promise<ProduitDistant>
    {
        const reponse = await fetch(`${this.base}/produits/${id}`);
        if (!reponse.ok)
        {
            throw new BadRequestException(`Produit introuvable : ${id}`);
        }
        return reponse.json() as Promise<ProduitDistant>;
    }
}