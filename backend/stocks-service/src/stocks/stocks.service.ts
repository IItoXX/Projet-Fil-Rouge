import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Stock } from './stock.entity';

@Injectable()
export class StocksService
{
    constructor(
        @InjectRepository(Stock) private readonly depot: Repository<Stock>,
        private readonly source: DataSource,
    )
    {
    }

    async lister(produitId?: string, magasinId?: string): Promise<Stock[]>
    {
        const filtre: FindOptionsWhere<Stock> = {};
        if (produitId)
        {
            filtre.produitId = produitId;
        }
        if (magasinId)
        {
            filtre.magasinId = magasinId;
        }
        return this.depot.find({ where: filtre });
    }

    async definir(produitId: string, magasinId: string, quantite: number): Promise<Stock>
    {
        let stock = await this.depot.findOne({ where: { produitId, magasinId } });
        if (!stock)
        {
            stock = this.depot.create({ produitId, magasinId, quantite });
        }
        else
        {
            stock.quantite = quantite;
        }
        return this.depot.save(stock);
    }

    async decrementer(produitId: string, magasinId: string, quantite: number): Promise<Stock>
    {
        return this.source.transaction(async (gestionnaire) =>
        {
            const stock = await gestionnaire.findOne(Stock, {
                where: { produitId, magasinId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!stock || stock.quantite < quantite)
            {
                throw new ConflictException('Stock insuffisant');
            }
            stock.quantite -= quantite;
            return gestionnaire.save(stock);
        });
    }

    async incrementer(produitId: string, magasinId: string, quantite: number): Promise<Stock>
    {
        return this.source.transaction(async (gestionnaire) =>
        {
            let stock = await gestionnaire.findOne(Stock, {
                where: { produitId, magasinId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!stock)
            {
                stock = gestionnaire.create(Stock, { produitId, magasinId, quantite });
            }
            else
            {
                stock.quantite += quantite;
            }
            return gestionnaire.save(stock);
        });
    }
}