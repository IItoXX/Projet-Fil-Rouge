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
  <p>Aucune commande pour l'instant.</p>
}
@for (commande of commandes(); track commande.id)
{
  <mat-card class="commande">
    <div class="entete-commande">
      <span class="ref">Commande {{ commande.id.slice(0, 8) }}</span>
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
        <button mat-stroked-button color="warn" (click)="annuler(commande.id)">Annuler</button>
      }
    </div>
  </mat-card>
}`,
    styles: [`
.commande { padding: 16px; margin-bottom: 12px; }
.entete-commande { display: flex; justify-content: space-between; align-items: center; }
.ref { font-weight: 600; }
.statut { padding: 2px 10px; border-radius: 12px; font-size: .8rem; color: #fff; }
.statut.validee { background: #2e7d32; }
.statut.annulee { background: #c62828; }
.statut.en_attente { background: #f9a825; }
.pied-commande { display: flex; justify-content: space-between; align-items: center; }
.total { font-weight: 700; }
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