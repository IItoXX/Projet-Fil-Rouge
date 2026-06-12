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
    <h1>{{ p.nom }}</h1>
    <p class="categorie">{{ p.categorie }}</p>
    <p class="description">{{ p.description }}</p>
    <p class="prix">{{ p.prix }} €</p>
    @if (quantiteStock() !== null)
    {
      @if (quantiteStock()! > 0)
      {
        <p class="stock">En stock : {{ quantiteStock() }}</p>
      }
      @else
      {
        <p class="rupture">Rupture de stock</p>
      }
    }
    <button mat-raised-button color="primary" (click)="ajouter(p)">
      <mat-icon>add_shopping_cart</mat-icon> Ajouter au panier
    </button>
  </mat-card>
}`,
    styles: [`
.detail { max-width: 600px; margin: 24px auto; padding: 24px; }
.categorie { opacity: .7; }
.prix { font-weight: 700; font-size: 1.4rem; }
.stock { color: #2e7d32; }
.rupture { color: #c62828; }
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