import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './core/auth.service';
import { PanierService } from './core/panier.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App
{
    protected readonly authService = inject(AuthService);
    protected readonly panierService = inject(PanierService);
    private readonly router = inject(Router);

    estVendeur(): boolean
    {
        const role = this.authService.utilisateur()?.role;
        return role === 'vendeur' || role === 'admin';
    }

    deconnexion(): void
    {
        this.authService.deconnexion();
        this.router.navigate(['/connexion']);
    }
}