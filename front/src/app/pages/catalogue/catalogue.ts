import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProduitsService } from '../../core/produits.service';
import { PanierService } from '../../core/panier.service';
import { Produit } from '../../core/modeles';

@Component({
    selector: 'app-catalogue',
    imports: [FormsModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
    template: `
<div class="entete">
  <h1>Catalogue</h1>
  <mat-form-field appearance="outline" class="recherche">
    <mat-label>Catégorie</mat-label>
    <input matInput [(ngModel)]="categorie" (keyup.enter)="filtrer()">
  </mat-form-field>
  <button mat-stroked-button (click)="filtrer()">Filtrer</button>
</div>

@if (produits().length === 0)
{
  <p>Aucun produit pour le moment.</p>
}

<div class="grille">
  @for (produit of produits(); track produit._id)
  {
    <mat-card class="carte-produit">
      @if (produit.imageUrl)
      {
        <img [src]="produit.imageUrl" [alt]="produit.nom">
      }
      @else
      {
        <div class="image-vide"><mat-icon>inventory_2</mat-icon></div>
      }
      <h3>{{ produit.nom }}</h3>
      <p class="categorie">{{ produit.categorie }}</p>
      <p class="prix">{{ produit.prix }} €</p>
      <div class="actions">
        <a mat-button [routerLink]="['/produit', produit._id]">Détail</a>
        <button mat-raised-button color="primary" (click)="ajouter(produit)">
          <mat-icon>add_shopping_cart</mat-icon>
        </button>
      </div>
    </mat-card>
  }
</div>`,
    styles: [`
.entete { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.entete h1 { flex: 1 1 auto; }
.recherche { width: 220px; }
.grille { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-top: 16px; }
.carte-produit { padding: 12px; }
.carte-produit img, .image-vide { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; }
.image-vide { display: flex; align-items: center; justify-content: center; background: var(--mat-sys-surface-container); }
.image-vide mat-icon { transform: scale(2.5); opacity: .5; }
.categorie { opacity: .7; font-size: .85rem; }
.prix { font-weight: 700; font-size: 1.1rem; }
.actions { display: flex; justify-content: space-between; align-items: center; }
`],
})
export class Catalogue implements OnInit
{
    protected readonly produits = signal<Produit[]>([]);
    protected categorie = '';
    private readonly produitsService = inject(ProduitsService);
    private readonly panierService = inject(PanierService);
    private readonly snack = inject(MatSnackBar);

    ngOnInit(): void
    {
        this.charger();
    }

    filtrer(): void
    {
        this.charger();
    }

    ajouter(produit: Produit): void
    {
        this.panierService.ajouter(produit);
        this.snack.open(`${produit.nom} ajouté au panier`, 'OK', { duration: 2000 });
    }

    private charger(): void
    {
        this.produitsService.lister(this.categorie || undefined).subscribe((produits) => this.produits.set(produits));
    }
}