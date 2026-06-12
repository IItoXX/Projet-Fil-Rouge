import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecuriteModule } from '../securite/securite.module';
import { Commande } from './commande.entity';
import { LigneCommande } from './ligne-commande.entity';
import { CommandesService } from './commandes.service';
import { CommandesController } from './commandes.controller';
import { ProduitsClient } from '../clients/produits.client';
import { StocksClient } from '../clients/stocks.client';
import { EvenementsClient } from '../clients/evenements.client';

@Module({
    imports: [TypeOrmModule.forFeature([Commande, LigneCommande]), SecuriteModule],
    controllers: [CommandesController],
    providers: [CommandesService, ProduitsClient, StocksClient, EvenementsClient],
})
export class CommandesModule
{
}