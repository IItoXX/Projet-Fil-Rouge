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
  <h1>Créer un compte</h1>
  <p class="sous-titre">Rejoignez Flapazon en quelques secondes.</p>
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
    <button mat-flat-button color="primary" type="submit">Créer mon compte</button>
  </form>
  <p class="lien">Déjà inscrit ? <a routerLink="/connexion">Se connecter</a></p>
</mat-card>`,
    styles: [`
.carte-auth { max-width: 400px; margin: 48px auto; padding: 32px; }
.carte-auth h1 { font-size: 1.6rem; margin-bottom: 4px; }
.sous-titre { color: var(--texte-doux); margin: 0 0 22px; }
.carte-auth form { display: flex; flex-direction: column; gap: 6px; }
.carte-auth button { margin-top: 10px; height: 44px; }
.erreur { color: #b42318; background: #fef3f2; border: 1px solid #fecaca; padding: 9px 12px; border-radius: 8px; font-size: .9rem; margin: 4px 0; }
.lien { margin-top: 18px; color: var(--texte-doux); font-size: .9rem; }
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