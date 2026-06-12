import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth.service';

@Component({
    selector: 'app-inscription',
    imports: [FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
    template: `
<mat-card class="carte-auth">
  <h1>Inscription</h1>
  <form (ngSubmit)="valider()">
    <mat-form-field appearance="outline">
      <mat-label>Nom</mat-label>
      <input matInput name="nom" [(ngModel)]="nom" required>
    </mat-form-field>
    <mat-form-field appearance="outline">
      <mat-label>Email</mat-label>
      <input matInput type="email" name="email" [(ngModel)]="email" required>
    </mat-form-field>
    <mat-form-field appearance="outline">
      <mat-label>Mot de passe (8 caractères min)</mat-label>
      <input matInput type="password" name="motDePasse" [(ngModel)]="motDePasse" required>
    </mat-form-field>
    <mat-form-field appearance="outline">
      <mat-label>Type de compte</mat-label>
      <mat-select name="role" [(ngModel)]="role">
        <mat-option value="client">Client (acheteur)</mat-option>
        <mat-option value="vendeur">Vendeur (magasin)</mat-option>
      </mat-select>
    </mat-form-field>
    @if (erreur())
    {
      <p class="erreur">{{ erreur() }}</p>
    }
    <button mat-raised-button color="primary" type="submit">Créer mon compte</button>
  </form>
  <p class="lien">Déjà inscrit ? <a routerLink="/connexion">Connexion</a></p>
</mat-card>`,
    styles: [`
.carte-auth { max-width: 420px; margin: 40px auto; padding: 24px; display: flex; flex-direction: column; }
.carte-auth form { display: flex; flex-direction: column; gap: 8px; }
.erreur { color: #c62828; margin: 4px 0; }
.lien { margin-top: 12px; }
`],
})
export class Inscription
{
    protected nom = '';
    protected email = '';
    protected motDePasse = '';
    protected role = 'client';
    protected readonly erreur = signal('');
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    valider(): void
    {
        this.authService.inscription(this.email, this.motDePasse, this.nom, this.role).subscribe({
            next: () => this.router.navigate(['/catalogue']),
            error: (probleme) => this.erreur.set(probleme?.error?.message ?? 'Inscription impossible'),
        });
    }
}