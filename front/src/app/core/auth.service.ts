import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReponseConnexion, Utilisateur } from './modeles';

@Injectable({ providedIn: 'root' })
export class AuthService
{
    private readonly base = environment.apiUrl;
    private readonly cleJeton = 'flapazon_jeton';
    private readonly cleUtilisateur = 'flapazon_utilisateur';

    readonly utilisateur = signal<Utilisateur | null>(this.chargerUtilisateur());
    readonly estConnecte = computed(() => this.utilisateur() !== null);

    constructor(private readonly http: HttpClient)
    {
    }

    connexion(email: string, motDePasse: string): Observable<ReponseConnexion>
    {
        return this.http.post<ReponseConnexion>(`${this.base}/auth/connexion`, { email, motDePasse }).pipe(
            tap((reponse) => this.enregistrer(reponse)),
        );
    }

    inscription(email: string, motDePasse: string, nom: string, role: string): Observable<ReponseConnexion>
    {
        return this.http.post<ReponseConnexion>(`${this.base}/auth/inscription`, { email, motDePasse, nom, role }).pipe(
            tap((reponse) => this.enregistrer(reponse)),
        );
    }

    deconnexion(): void
    {
        localStorage.removeItem(this.cleJeton);
        localStorage.removeItem(this.cleUtilisateur);
        this.utilisateur.set(null);
    }

    get jeton(): string | null
    {
        return localStorage.getItem(this.cleJeton);
    }

    private enregistrer(reponse: ReponseConnexion): void
    {
        localStorage.setItem(this.cleJeton, reponse.accessToken);
        localStorage.setItem(this.cleUtilisateur, JSON.stringify(reponse.utilisateur));
        this.utilisateur.set(reponse.utilisateur);
    }

    private chargerUtilisateur(): Utilisateur | null
    {
        const brut = localStorage.getItem(this.cleUtilisateur);
        if (!brut)
        {
            return null;
        }
        return JSON.parse(brut);
    }
}