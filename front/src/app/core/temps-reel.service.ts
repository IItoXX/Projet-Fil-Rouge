import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

export interface EvenementTempsReel
{
    type: string;
    donnee: any;
}

@Injectable({ providedIn: 'root' })
export class TempsReelService
{
    private socket?: Socket;
    private readonly sujet = new Subject<EvenementTempsReel>();
    readonly evenements = this.sujet.asObservable();
    private readonly types = ['commande.validee', 'commande.annulee', 'stock.rupture'];

    connecter(): void
    {
        if (this.socket)
        {
            return;
        }
        this.socket = io(environment.apiUrl, { transports: ['websocket', 'polling'] });
        for (const type of this.types)
        {
            this.socket.on(type, (donnee) => this.sujet.next({ type, donnee }));
        }
    }
}