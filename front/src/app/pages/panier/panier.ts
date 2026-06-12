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
  <mat-card class="vide">
    <p>Votre panier est vide.</p>
    <a mat-flat-button color="primary" routerLink="/catalogue">Parcourir le catalogue</a>
  </mat-card>
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
      <button mat-icon-button (click)="retirer(article.produit._id)"><mat-icon>close</mat-icon></button>
    </mat-card>
  }
  <div class="pied">
    <span class="total-label">Total</span>
    <span class="total">{{ panierService.total() }} €</span>
    <button mat-flat-button color="primary" (click)="commander()">Valider la commande</button>
  </div>
  @if (erreur())
  {
    <p class="erreur">{{ erreur() }}</p>
  }
}`,
    styles: [`
h1 { margin-bottom: 20px; }
.vide { padding: 40px; text-align: center; }
.vide p { color: var(--texte-doux); margin-bottom: 16px; }
.ligne { display: flex; align-items: center; gap: 16px; padding: 14px 18px; margin-bottom: 10px; }
.ligne .nom { flex: 1 1 auto; font-weight: 600; }
.ligne .pu { color: var(--texte-doux); width: 70px; }
.qte { width: 64px; padding: 7px 8px; border: 1px solid var(--bordure); border-radius: 8px; font: inherit; }
.sous-total { width: 90px; text-align: right; font-weight: 700; }
.pied { display: flex; align-items: center; gap: 20px; justify-content: flex-end; margin-top: 18px; padding: 18px; background: var(--surface); border: 1px solid var(--bordure); border-radius: 12px; }
.total-label { color: var(--texte-doux); }
.total { font-size: 1.4rem; font-weight: 800; margin-right: 12px; }
.pied button { height: 44px; padding: 0 28px; }
.erreur { color: #b42318; background: #fef3f2; border: 1px solid #fecaca; padding: 10px 14px; border-radius: 8px; margin-top: 14px; }
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