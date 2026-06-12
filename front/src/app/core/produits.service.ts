import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Produit } from './modeles';

@Injectable({ providedIn: 'root' })
export class ProduitsService
{
    private readonly base = `${environment.apiUrl}/produits`;

    constructor(private readonly http: HttpClient)
    {
    }

    lister(categorie?: string): Observable<Produit[]>
    {
        const params: Record<string, string> = {};
        if (categorie)
        {
            params['categorie'] = categorie;
        }
        return this.http.get<Produit[]>(this.base, { params });
    }

    listerParMagasin(magasinId: string): Observable<Produit[]>
    {
        return this.http.get<Produit[]>(this.base, { params: { magasinId } });
    }

    detail(id: string): Observable<Produit>
    {
        return this.http.get<Produit>(`${this.base}/${id}`);
    }

    creer(produit: Partial<Produit>): Observable<Produit>
    {
        return this.http.post<Produit>(this.base, produit);
    }

    modifier(id: string, produit: Partial<Produit>): Observable<Produit>
    {
        return this.http.patch<Produit>(`${this.base}/${id}`, produit);
    }

    supprimer(id: string): Observable<void>
    {
        return this.http.delete<void>(`${this.base}/${id}`);
    }
}