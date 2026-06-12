import { computed, Injectable, signal } from '@angular/core';
import { ArticlePanier, Produit } from './modeles';

@Injectable({ providedIn: 'root' })
export class PanierService
{
    readonly articles = signal<ArticlePanier[]>([]);
    readonly total = computed(() => this.articles().reduce((somme, article) => somme + article.produit.prix * article.quantite, 0));
    readonly nombre = computed(() => this.articles().reduce((somme, article) => somme + article.quantite, 0));

    ajouter(produit: Produit): void
    {
        const articles = [...this.articles()];
        const existant = articles.find((article) => article.produit._id === produit._id);
        if (existant)
        {
            existant.quantite += 1;
        }
        else
        {
            articles.push({ produit, quantite: 1 });
        }
        this.articles.set(articles);
    }

    changerQuantite(produitId: string, quantite: number): void
    {
        if (quantite < 1)
        {
            return;
        }
        this.articles.set(this.articles().map((article) =>
            article.produit._id === produitId ? { ...article, quantite } : article));
    }

    retirer(produitId: string): void
    {
        this.articles.set(this.articles().filter((article) => article.produit._id !== produitId));
    }

    vider(): void
    {
        this.articles.set([]);
    }
}