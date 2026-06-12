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
<section class="hero">
  <h1>La marketplace de tous vos achats.</h1>
  <p>Des milliers de produits proposés par des magasins de confiance, livrés où vous voulez.</p>
</section>

<div class="entete">
  <div>
    <h2>Nos produits</h2>
    <span class="compteur">{{ produits().length }} article(s)</span>
  </div>
  <span class="espace"></span>
  <mat-form-field appearance="outline" subscriptSizing="dynamic" class="recherche">
    <mat-icon matPrefix>search</mat-icon>
    <input matInput placeholder="Rechercher une catégorie" [(ngModel)]="categorie" (keyup.enter)="filtrer()">
  </mat-form-field>
</div>

@if (produits().length === 0)
{
  <p class="vide">Aucun produit ne correspond à votre recherche.</p>
}

<div class="grille">
  @for (produit of produits(); track produit._id)
  {
    <mat-card class="carte-produit">
      <a class="visuel" [routerLink]="['/produit', produit._id]">
        @if (produit.imageUrl)
        {
          <img [src]="produit.imageUrl" [alt]="produit.nom">
        }
        @else
        {
          <mat-icon>inventory_2</mat-icon>
        }
      </a>
      <div class="infos">
        <span class="categorie">{{ produit.categorie }}</span>
        <h3><a [routerLink]="['/produit', produit._id]">{{ produit.nom }}</a></h3>
        <div class="bas">
          <span class="prix">{{ produit.prix }} €</span>
          <button mat-flat-button color="primary" (click)="ajouter(produit)">Ajouter</button>
        </div>
      </div>
    </mat-card>
  }
</div>`,
    styles: [`
.hero { padding: 24px 0 32px; margin-bottom: 28px; border-bottom: 1px solid var(--bordure); }
.hero h1 { font-size: 2.7rem; font-weight: 800; line-height: 1.08; max-width: 720px; margin: 0; }
.hero p { color: var(--texte-doux); font-size: 1.15rem; max-width: 580px; margin: 14px 0 0; }
.entete { display: flex; align-items: flex-end; gap: 16px; margin-bottom: 20px; }
.entete h2 { margin: 0; }
.compteur { color: var(--texte-doux); font-size: .85rem; }
.espace { flex: 1 1 auto; }
.recherche { width: 300px; }
.vide { color: var(--texte-doux); }
.grille { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
.carte-produit { padding: 0 !important; overflow: hidden; transition: box-shadow .18s ease, transform .18s ease; }
.carte-produit:hover { box-shadow: 0 10px 28px rgba(16, 24, 40, .10) !important; transform: translateY(-2px); }
.visuel { display: flex; align-items: center; justify-content: center; height: 180px; background: #eef1f5; }
.visuel:hover { text-decoration: none; }
.visuel img { width: 100%; height: 100%; object-fit: cover; }
.visuel mat-icon { color: #c2c8d2; transform: scale(2.4); }
.infos { padding: 16px; }
.categorie { font-size: .7rem; text-transform: uppercase; letter-spacing: .07em; color: var(--texte-doux); font-weight: 700; }
.infos h3 { margin: 6px 0 16px; font-size: 1.02rem; font-weight: 600; }
.infos h3 a { color: var(--texte); }
.infos h3 a:hover { color: var(--accent); text-decoration: none; }
.bas { display: flex; align-items: center; justify-content: space-between; }
.prix { font-size: 1.35rem; font-weight: 800; }
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