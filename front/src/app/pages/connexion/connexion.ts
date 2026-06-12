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
    <button mat-raised-button color="primary" type="submit">Se connecter</button>
  </form>
  <p class="lien">Pas encore de compte ? <a routerLink="/inscription">Inscription</a></p>
</mat-card>`,
    styles: [`
.carte-auth { max-width: 420px; margin: 40px auto; padding: 24px; display: flex; flex-direction: column; }
.carte-auth form { display: flex; flex-direction: column; gap: 8px; }
.erreur { color: #c62828; margin: 4px 0; }
.lien { margin-top: 12px; }
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