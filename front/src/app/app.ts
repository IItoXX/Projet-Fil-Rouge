import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './core/auth.service';
import { PanierService } from './core/panier.service';
import { EvenementTempsReel, TempsReelService } from './core/temps-reel.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, MatSnackBarModule],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements OnInit
{
    protected readonly authService = inject(AuthService);
    protected readonly panierService = inject(PanierService);
    private readonly router = inject(Router);
    private readonly tempsReel = inject(TempsReelService);
    private readonly snack = inject(MatSnackBar);

    ngOnInit(): void
    {
        this.tempsReel.connecter();
        this.tempsReel.evenements.subscribe((evenement) => this.notifier(evenement));
    }

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

    private notifier(evenement: EvenementTempsReel): void
    {
        const messages: Record<string, string> = {
            'commande.validee': 'Nouvelle commande validée',
            'commande.annulee': 'Une commande a été annulée',
            'stock.rupture': 'Rupture de stock détectée',
        };
        this.snack.open(messages[evenement.type] ?? 'Événement reçu', 'Fermer', { duration: 4000 });
    }
}