import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commande } from './commande.entity';
import { StatutCommande } from './statut-commande.enum';
import { CreerCommandeDto } from './dto/creer-commande.dto';
import { ProduitsClient } from '../clients/produits.client';
import { StocksClient } from '../clients/stocks.client';
import { EvenementsClient } from '../clients/evenements.client';
import { RoleUtilisateur } from '../securite/role.enum';

interface LignePreparee
{
    produitId: string;
    magasinId: string;
    quantite: number;
    prixUnitaire: number;
}

@Injectable()
export class CommandesService
{
    constructor(
        @InjectRepository(Commande) private readonly depot: Repository<Commande>,
        private readonly produitsClient: ProduitsClient,
        private readonly stocksClient: StocksClient,
        private readonly evenementsClient: EvenementsClient,
    )
    {
    }

    async creer(creerCommandeDto: CreerCommandeDto, clientId: string): Promise<Commande>
    {
        const lignes: LignePreparee[] = [];
        let total = 0;
        for (const ligne of creerCommandeDto.lignes)
        {
            const produit = await this.produitsClient.recupererProduit(ligne.produitId);
            lignes.push({
                produitId: ligne.produitId,
                magasinId: produit.magasinId,
                quantite: ligne.quantite,
                prixUnitaire: produit.prix,
            });
            total += produit.prix * ligne.quantite;
        }

        const decrementees: LignePreparee[] = [];
        try
        {
            for (const ligne of lignes)
            {
                await this.stocksClient.decrementer(ligne.produitId, ligne.magasinId, ligne.quantite);
                decrementees.push(ligne);
            }
        }
        catch (erreur)
        {
            for (const ligne of decrementees)
            {
                await this.stocksClient.incrementer(ligne.produitId, ligne.magasinId, ligne.quantite);
            }
            throw new ConflictException('Stock insuffisant pour valider la commande');
        }

        const commande = this.depot.create({
            clientId,
            statut: StatutCommande.VALIDEE,
            total,
            lignes,
        });
        const enregistree = await this.depot.save(commande);
        await this.evenementsClient.publier('commande.validee', { commandeId: enregistree.id, clientId, total });
        return enregistree;
    }

    async lister(clientId: string, role: RoleUtilisateur): Promise<Commande[]>
    {
        if (role === RoleUtilisateur.ADMIN)
        {
            return this.depot.find();
        }
        return this.depot.find({ where: { clientId } });
    }

    async trouverPourUtilisateur(id: string, clientId: string, role: RoleUtilisateur): Promise<Commande>
    {
        const commande = await this.depot.findOne({ where: { id } });
        if (!commande)
        {
            throw new NotFoundException('Commande introuvable');
        }
        if (role !== RoleUtilisateur.ADMIN && commande.clientId !== clientId)
        {
            throw new ForbiddenException('Cette commande ne vous appartient pas');
        }
        return commande;
    }

    async annuler(id: string, clientId: string, role: RoleUtilisateur): Promise<Commande>
    {
        const commande = await this.trouverPourUtilisateur(id, clientId, role);
        if (commande.statut !== StatutCommande.VALIDEE)
        {
            throw new ConflictException('Seule une commande validee peut etre annulee');
        }
        for (const ligne of commande.lignes)
        {
            await this.stocksClient.incrementer(ligne.produitId, ligne.magasinId, ligne.quantite);
        }
        commande.statut = StatutCommande.ANNULEE;
        const enregistree = await this.depot.save(commande);
        await this.evenementsClient.publier('commande.annulee', { commandeId: enregistree.id });
        return enregistree;
    }
}