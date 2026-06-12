import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { vendeurGuard } from './core/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
    { path: 'connexion', loadComponent: () => import('./pages/connexion/connexion').then((m) => m.Connexion) },
    { path: 'inscription', loadComponent: () => import('./pages/inscription/inscription').then((m) => m.Inscription) },
    { path: 'catalogue', loadComponent: () => import('./pages/catalogue/catalogue').then((m) => m.Catalogue) },
    { path: 'produit/:id', loadComponent: () => import('./pages/produit-detail/produit-detail').then((m) => m.ProduitDetail) },
    { path: 'panier', canActivate: [authGuard], loadComponent: () => import('./pages/panier/panier').then((m) => m.Panier) },
    { path: 'mes-commandes', canActivate: [authGuard], loadComponent: () => import('./pages/mes-commandes/mes-commandes').then((m) => m.MesCommandes) },
    { path: 'vendeur', canActivate: [vendeurGuard], loadComponent: () => import('./pages/vendeur-produits/vendeur-produits').then((m) => m.VendeurProduits) },
    { path: '**', redirectTo: 'catalogue' },
];