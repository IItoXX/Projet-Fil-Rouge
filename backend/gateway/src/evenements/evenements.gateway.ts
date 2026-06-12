import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL ?? 'http://localhost:4200' } })
export class EvenementsGateway
{
    @WebSocketServer()
    serveur: Server;

    diffuser(type: string, donnee: unknown): void
    {
        this.serveur.emit(type, donnee);
    }
}