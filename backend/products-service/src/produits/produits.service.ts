import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Produit, ProduitDocument } from './produit.schema';
import { CreerProduitDto } from './dto/creer-produit.dto';
import { ModifierProduitDto } from './dto/modifier-produit.dto';
import { RoleUtilisateur } from '../securite/role.enum';

@Injectable()
export class ProduitsService
{
    constructor(
        @InjectModel(Produit.name) private readonly modeleProduit: Model<ProduitDocument>,
    )
    {
    }

    async creer(creerProduitDto: CreerProduitDto, magasinId: string): Promise<Produit>
    {
        const produit = new this.modeleProduit({ ...creerProduitDto, magasinId });
        return produit.save();
    }

    async lister(categorie?: string, magasinId?: string): Promise<Produit[]>
    {
        const filtre: FilterQuery<ProduitDocument> = { actif: true };
        if (categorie)
        {
            filtre.categorie = categorie;
        }
        if (magasinId)
        {
            filtre.magasinId = magasinId;
        }
        return this.modeleProduit.find(filtre).exec();
    }

    async trouverParId(id: string): Promise<ProduitDocument>
    {
        const produit = await this.modeleProduit.findById(id).exec();
        if (!produit)
        {
            throw new NotFoundException('Produit introuvable');
        }
        return produit;
    }

    async modifier(id: string, modifierProduitDto: ModifierProduitDto, idUtilisateur: string, role: RoleUtilisateur): Promise<Produit>
    {
        const produit = await this.trouverParId(id);
        this.verifierProprietaire(produit, idUtilisateur, role);
        Object.assign(produit, modifierProduitDto);
        return produit.save();
    }

    async supprimer(id: string, idUtilisateur: string, role: RoleUtilisateur): Promise<void>
    {
        const produit = await this.trouverParId(id);
        this.verifierProprietaire(produit, idUtilisateur, role);
        await this.modeleProduit.findByIdAndDelete(id).exec();
    }

    private verifierProprietaire(produit: ProduitDocument, idUtilisateur: string, role: RoleUtilisateur)
    {
        if (role !== RoleUtilisateur.ADMIN && produit.magasinId !== idUtilisateur)
        {
            throw new ForbiddenException('Ce produit ne vous appartient pas');
        }
    }
}