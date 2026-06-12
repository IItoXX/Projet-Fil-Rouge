import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth.service';

@Component({
    selector: 'app-connexion',
    imports: [FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    template: `
<mat-card class="carte-auth">
  <h1>Connexion</h1>
  <p class="sous-titre">Accédez à votre compte Flapazon.</p>
  <form (ngSubmit)="valider()">
    <mat-form-field appearance="outline">
      <mat-label>Email</mat-label>
      <input matInput type="email" name="email" [(ngModel)]="email" required>
    </mat-form-field>
    <mat-form-field appearance="outline">
      <mat-label>Mot de passe</mat-label>
      <input matInput type="password" name="motDePasse" [(ngModel)]="motDePasse" required>
    </mat-form-field>
    @if (erreur())
    {
      <p class="erreur">{{ erreur() }}</p>
    }
    <button mat-flat-button color="primary" type="submit">Se connecter</button>
  </form>
  <p class="lien">Pas encore de compte ? <a routerLink="/inscription">Créer un compte</a></p>
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
export class Connexion
{
    protected email = '';
    protected motDePasse = '';
    protected readonly erreur = signal('');
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    valider(): void
    {
        this.authService.connexion(this.email, this.motDePasse).subscribe({
            next: () => this.router.navigate(['/catalogue']),
            error: () => this.erreur.set('Identifiants invalides'),
        });
    }
}