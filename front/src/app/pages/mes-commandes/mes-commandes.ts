import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommandesService } from '../../core/commandes.service';
import { Commande, StatutCommande } from '../../core/modeles';

@Component({
    selector: 'app-mes-commandes',
    imports: [MatCardModule, MatButtonModule, MatSnackBarModule],
    template: `
<h1>Mes commandes</h1>
@if (commandes().length === 0)
{
  <p class="vide">Vous n'avez pas encore passé de commande.</p>
}
@for (commande of commandes(); track commande.id)
{
  <mat-card class="commande">
    <div class="entete-commande">
      <span class="ref">Commande #{{ commande.id.slice(0, 8) }}</span>
      <span class="statut" [class]="commande.statut">{{ libelle(commande.statut) }}</span>
    </div>
    <ul>
      @for (ligne of commande.lignes; track ligne.produitId)
      {
        <li>{{ ligne.quantite }} × {{ ligne.prixUnitaire }} €</li>
      }
    </ul>
    <div class="pied-commande">
      <span class="total">Total : {{ commande.total }} €</span>
      @if (commande.statut === 'validee')
      {
        <button mat-stroked-button (click)="annuler(commande.id)">Annuler la commande</button>
      }
    </div>
  </mat-card>
}`,
    styles: [`
h1 { margin-bottom: 20px; }
.vide { color: var(--texte-doux); }
.commande { padding: 20px; margin-bottom: 14px; }
.entete-commande { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.ref { font-weight: 700; }
.statut { padding: 3px 11px; border-radius: 6px; font-size: .75rem; font-weight: 700; }
.statut.validee { background: #ecfdf3; color: #027a48; border: 1px solid #a6f4c5; }
.statut.annulee { background: #fef3f2; color: #b42318; border: 1px solid #fecaca; }
.statut.en_attente { background: #fffaeb; color: #b54708; border: 1px solid #fedf89; }
.commande ul { margin: 8px 0; padding-left: 18px; color: var(--texte-doux); }
.pied-commande { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 14px; border-top: 1px solid var(--bordure); }
.total { font-weight: 800; font-size: 1.05rem; }
`],
})
export class MesCommandes implements OnInit
{
    protected readonly commandes = signal<Commande[]>([]);
    private readonly commandesService = inject(CommandesService);
    private readonly snack = inject(MatSnackBar);

    ngOnInit(): void
    {
        this.charger();
    }

    libelle(statut: StatutCommande): string
    {
        const libelles: Record<StatutCommande, string> = { en_attente: 'En attente', validee: 'Validée', annulee: 'Annulée' };
        return libelles[statut];
    }

    annuler(id: string): void
    {
        this.commandesService.annuler(id).subscribe(() =>
        {
            this.snack.open('Commande annulée', 'OK', { duration: 2000 });
            this.charger();
        });
    }

    private charger(): void
    {
        this.commandesService.mesCommandes().subscribe((commandes) => this.commandes.set(commandes));
    }
}