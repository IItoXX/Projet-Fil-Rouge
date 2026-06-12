import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Commande } from './modeles';

@Injectable({ providedIn: 'root' })
export class CommandesService
{
    private readonly base = `${environment.apiUrl}/commandes`;

    constructor(private readonly http: HttpClient)
    {
    }

    passer(lignes: { produitId: string; quantite: number }[]): Observable<Commande>
    {
        return this.http.post<Commande>(this.base, { lignes });
    }

    mesCommandes(): Observable<Commande[]>
    {
        return this.http.get<Commande[]>(this.base);
    }

    annuler(id: string): Observable<Commande>
    {
        return this.http.patch<Commande>(`${this.base}/${id}/annuler`, {});
    }
}