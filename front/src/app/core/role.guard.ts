import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const vendeurGuard: CanActivateFn = () =>
{
    const authService = inject(AuthService);
    const router = inject(Router);
    const utilisateur = authService.utilisateur();
    if (utilisateur && (utilisateur.role === 'vendeur' || utilisateur.role === 'admin'))
    {
        return true;
    }
    return router.createUrlTree(['/catalogue']);
};