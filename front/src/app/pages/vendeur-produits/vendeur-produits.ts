import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProduitsService } from '../../core/produits.service';
import { StocksService } from '../../core/stocks.service';
import { AuthService } from '../../core/auth.service';
import { Produit } from '../../core/modeles';

@Component({
    selector: 'app-vendeur-produits',
    imports: [FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
    template: `
<h1>Mon magasin</h1>

<mat-card class="formulaire">
  <h2>Ajouter un produit</h2>
  <form (ngSubmit)="ajouterProduit()">
    <mat-form-field appearance="outline"><mat-label>Nom</mat-label><input matInput name="nom" [(ngModel)]="nouveau.nom" required></mat-form-field>
    <mat-form-field appearance="outline"><mat-label>Catégorie</mat-label><input matInput name="categorie" [(ngModel)]="nouveau.categorie" required></mat-form-field>
    <mat-form-field appearance="outline"><mat-label>Prix (€)</mat-label><input matInput type="number" name="prix" [(ngModel)]="nouveau.prix" required></mat-form-field>
    <mat-form-field appearance="outline" class="large"><mat-label>Description</mat-label><input matInput name="description" [(ngModel)]="nouveau.description"></mat-form-field>
    <button mat-flat-button color="primary" type="submit">Ajouter le produit</button>
  </form>
</mat-card>

<h2 class="titre-liste">Mes produits</h2>
@if (produits().length === 0)
{
  <p class="vide">Vous n'avez pas encore de produit.</p>
}
@for (produit of produits(); track produit._id)
{
  <mat-card class="ligne-produit">
    <span class="nom">{{ produit.nom }}</span>
    <span class="prix">{{ produit.prix }} €</span>
    <span class="stock">Stock actuel : {{ stockDe(produit._id) }}</span>
    <input type="number" min="0" [(ngModel)]="quantites[produit._id]" class="qte" placeholder="Qté">
    <button mat-stroked-button (click)="definirStock(produit._id)">Mettre à jour</button>
    <button mat-icon-button (click)="supprimer(produit._id)"><mat-icon>delete_outline</mat-icon></button>
  </mat-card>
}`,
    styles: [`
h1 { margin-bottom: 20px; }
h2 { font-size: 1.15rem; }
.titre-liste { margin: 30px 0 14px; }
.formulaire { padding: 24px; }
.formulaire h2 { margin-top: 0; margin-bottom: 16px; }
.formulaire form { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
.formulaire mat-form-field { flex: 1 1 200px; }
.formulaire .large { flex: 1 1 100%; }
.ligne-produit { display: flex; align-items: center; gap: 16px; padding: 14px 18px; margin-bottom: 10px; }
.ligne-produit .nom { flex: 1 1 auto; font-weight: 600; }
.ligne-produit .prix { font-weight: 700; min-width: 70px; }
.ligne-produit .stock { color: var(--texte-doux); font-size: .9rem; }
.qte { width: 80px; padding: 7px 8px; border: 1px solid var(--bordure); border-radius: 8px; font: inherit; }
.vide { color: var(--texte-doux); }
`],
})
export class VendeurProduits implements OnInit
{
    protected readonly produits = signal<Produit[]>([]);
    protected readonly stocks = signal<Record<string, number>>({});
    protected quantites: Record<string, number> = {};
    protected nouveau = { nom: '', categorie: '', prix: 0, description: '' };
    private readonly produitsService = inject(ProduitsService);
    private readonly stocksService = inject(StocksService);
    private readonly authService = inject(AuthService);
    private readonly snack = inject(MatSnackBar);

    ngOnInit(): void
    {
        this.charger();
    }

    stockDe(produitId: string): number
    {
        return this.stocks()[produitId] ?? 0;
    }

    ajouterProduit(): void
    {
        this.produitsService.creer({ ...this.nouveau, prix: Number(this.nouveau.prix) }).subscribe(() =>
        {
            this.nouveau = { nom: '', categorie: '', prix: 0, description: '' };
            this.snack.open('Produit ajouté', 'OK', { duration: 2000 });
            this.charger();
        });
    }

    definirStock(produitId: string): void
    {
        const quantite = Number(this.quantites[produitId] ?? 0);
        this.stocksService.definir(produitId, quantite).subscribe(() =>
        {
            this.snack.open('Stock mis à jour', 'OK', { duration: 2000 });
            this.charger();
        });
    }

    supprimer(produitId: string): void
    {
        this.produitsService.supprimer(produitId).subscribe(() =>
        {
            this.snack.open('Produit supprimé', 'OK', { duration: 2000 });
            this.charger();
        });
    }

    private charger(): void
    {
        const magasinId = this.authService.utilisateur()?.id;
        if (!magasinId)
        {
            return;
        }
        this.produitsService.listerParMagasin(magasinId).subscribe((produits) => this.produits.set(produits));
        this.stocksService.parMagasin(magasinId).subscribe((stocks) =>
        {
            const table: Record<string, number> = {};
            for (const stock of stocks)
            {
                table[stock.produitId] = stock.quantite;
            }
            this.stocks.set(table);
        });
    }
}