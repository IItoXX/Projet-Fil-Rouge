import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const jetonInterceptor: HttpInterceptorFn = (requete, suivant) =>
{
    const authService = inject(AuthService);
    const jeton = authService.jeton;
    if (jeton)
    {
        requete = requete.clone({ setHeaders: { Authorization: `Bearer ${jeton}` } });
    }
    return suivant(requete);
};