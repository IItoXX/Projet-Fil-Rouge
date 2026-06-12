export type RoleUtilisateur = 'client' | 'vendeur' | 'admin';

export interface Utilisateur
{
    id: string;
    email: string;
    nom: string;
    role: RoleUtilisateur;
}

export interface ReponseConnexion
{
    accessToken: string;
    utilisateur: Utilisateur;
}

export interface Produit
{
    _id: string;
    nom: string;
    description: string;
    prix: number;
    categorie: string;
    magasinId: string;
    imageUrl: string;
    actif: boolean;
}

export interface Stock
{
    id: string;
    produitId: string;
    magasinId: string;
    quantite: number;
}

export interface LigneCommande
{
    produitId: string;
    magasinId: string;
    quantite: number;
    prixUnitaire: number;
}

export type StatutCommande = 'en_attente' | 'validee' | 'annulee';

export interface Commande
{
    id: string;
    clientId: string;
    statut: StatutCommande;
    total: number;
    lignes: LigneCommande[];
    creeLe: string;
}

export interface ArticlePanier
{
    produit: Produit;
    quantite: number;
}