import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SecuriteModule } from '../securite/securite.module';
import { Produit, ProduitSchema } from './produit.schema';
import { ProduitsService } from './produits.service';
import { ProduitsController } from './produits.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Produit.name, schema: ProduitSchema }]),
        SecuriteModule,
    ],
    controllers: [ProduitsController],
    providers: [ProduitsService],
})
export class ProduitsModule
{
}