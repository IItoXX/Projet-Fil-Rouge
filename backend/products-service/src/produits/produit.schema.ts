import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProduitDocument = HydratedDocument<Produit>;

@Schema({ timestamps: true })
export class Produit
{
    @Prop({ required: true })
    nom: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ required: true })
    prix: number;

    @Prop({ required: true })
    categorie: string;

    @Prop({ required: true })
    magasinId: string;

    @Prop({ default: '' })
    imageUrl: string;

    @Prop({ default: true })
    actif: boolean;
}

export const ProduitSchema = SchemaFactory.createForClass(Produit);