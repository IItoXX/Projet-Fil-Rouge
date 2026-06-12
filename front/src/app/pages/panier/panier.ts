import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PanierService } from '../../core/panier.service';
import { CommandesService } from '../../core/commandes.service';

@Component({
    selector: 'app-panier',
    imports: [FormsModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
    template: `
<h1>Mon panier</h1>
@if (panierService.articles().length === 0)
{
  <p>Votre panier est vide. <a routerLink="/catalogue">Voir le catalogue</a></p>
}
@else
{
  @for (article of panierService.articles(); track article.produit._id)
  {
    <mat-card class="ligne">
      <span class="nom">{{ article.produit.nom }}</span>
      <span class="pu">{{ article.produit.prix }} €</span>
      <input type="number" min="1" [ngModel]="article.quantite" (ngModelChange)="changer(article.produit._id, $event)" class="qte">
      <span class="sous-total">{{ article.produit.prix * article.quantite }} €</span>
      <button mat-icon-button color="warn" (click)="retirer(article.produit._id)"><mat-icon>delete</mat-icon></button>
    </mat-card>
  }
  <div class="pied">
    <span class="total">Total : {{ panierService.total() }} €</span>
    <button mat-raised-button color="primary" (click)="commander()">Commander</button>
  </div>
  @if (erreur())
  {
    <p class="erreur">{{ erreur() }}</p>
  }
}`,
    styles: [`
.ligne { display: flex; align-items: center; gap: 16px; padding: 12px 16px; margin-bottom: 8px; }
.ligne .nom { flex: 1 1 auto; font-weight: 600; }
.qte { width: 64px; }
.sous-total { width: 80px; text-align: right; font-weight: 600; }
.pied { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
.total { font-size: 1.3rem; font-weight: 700; }
.erreur { color: #c62828; margin-top: 12px; }
`],
})
export class Panier
{
    protected readonly erreur = signal('');
    protected readonly panierService = inject(PanierService);
    private readonly commandesService = inject(CommandesService);
    private readonly router = inject(Router);
    private readonly snack = inject(MatSnackBar);

    changer(produitId: string, quantite: number): void
    {
        this.panierService.changerQuantite(produitId, Number(quantite));
    }

    retirer(produitId: string): void
    {
        this.panierService.retirer(produitId);
    }

    commander(): void
    {
        const lignes = this.panierService.articles().map((article) => ({ produitId: article.produit._id, quantite: article.quantite }));
        this.commandesService.passer(lignes).subscribe({
            next: () =>
            {
                this.panierService.vider();
                this.snack.open('Commande validée', 'OK', { duration: 2500 });
                this.router.navigate(['/mes-commandes']);
            },
            error: (probleme) => this.erreur.set(probleme?.error?.message ?? 'Commande impossible (stock insuffisant ?)'),
        });
    }
}