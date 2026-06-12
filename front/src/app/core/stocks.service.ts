import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Stock } from './modeles';

@Injectable({ providedIn: 'root' })
export class StocksService
{
    private readonly base = `${environment.apiUrl}/stocks`;

    constructor(private readonly http: HttpClient)
    {
    }

    parProduit(produitId: string): Observable<Stock[]>
    {
        return this.http.get<Stock[]>(this.base, { params: { produitId } });
    }

    parMagasin(magasinId: string): Observable<Stock[]>
    {
        return this.http.get<Stock[]>(this.base, { params: { magasinId } });
    }

    definir(produitId: string, quantite: number): Observable<Stock>
    {
        return this.http.post<Stock>(this.base, { produitId, quantite });
    }
}