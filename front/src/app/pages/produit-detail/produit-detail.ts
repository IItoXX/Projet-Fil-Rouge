import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProduitsService } from '../../core/produits.service';
import { StocksService } from '../../core/stocks.service';
import { PanierService } from '../../core/panier.service';
import { Produit } from '../../core/modeles';

@Component({
    selector: 'app-produit-detail',
    imports: [MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
    template: `
@if (produit(); as p)
{
  <mat-card class="detail">
    <span class="categorie">{{ p.categorie }}</span>
    <h1>{{ p.nom }}</h1>
    <p class="prix">{{ p.prix }} €</p>
    <p class="description">{{ p.description || 'Aucune description disponible.' }}</p>
    @if (quantiteStock() !== null)
    {
      @if (quantiteStock()! > 0)
      {
        <p class="stock">En stock — {{ quantiteStock() }} disponible(s)</p>
      }
      @else
      {
        <p class="rupture">Rupture de stock</p>
      }
    }
    <button mat-flat-button color="primary" (click)="ajouter(p)">Ajouter au panier</button>
  </mat-card>
}`,
    styles: [`
.detail { max-width: 640px; margin: 8px auto; padding: 32px; }
.categorie { font-size: .72rem; text-transform: uppercase; letter-spacing: .07em; color: var(--texte-doux); font-weight: 700; }
.detail h1 { font-size: 1.9rem; margin: 8px 0; }
.prix { font-weight: 800; font-size: 1.8rem; margin: 8px 0; }
.description { color: #374151; margin: 16px 0; line-height: 1.6; }
.stock { color: #027a48; font-weight: 600; }
.rupture { color: #b42318; font-weight: 600; }
.detail button { margin-top: 18px; height: 46px; padding: 0 30px; }
`],
})
export class ProduitDetail implements OnInit
{
    protected readonly produit = signal<Produit | null>(null);
    protected readonly quantiteStock = signal<number | null>(null);
    private readonly route = inject(ActivatedRoute);
    private readonly produitsService = inject(ProduitsService);
    private readonly stocksService = inject(StocksService);
    private readonly panierService = inject(PanierService);
    private readonly snack = inject(MatSnackBar);

    ngOnInit(): void
    {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id)
        {
            return;
        }
        this.produitsService.detail(id).subscribe((produit) =>
        {
            this.produit.set(produit);
            this.chargerStock(produit._id);
        });
    }

    ajouter(produit: Produit): void
    {
        this.panierService.ajouter(produit);
        this.snack.open(`${produit.nom} ajouté au panier`, 'OK', { duration: 2000 });
    }

    private chargerStock(produitId: string): void
    {
        this.stocksService.parProduit(produitId).subscribe({
            next: (stocks) => this.quantiteStock.set(stocks.reduce((somme, stock) => somme + stock.quantite, 0)),
            error: () => this.quantiteStock.set(null),
        });
    }
}