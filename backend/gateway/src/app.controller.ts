import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController
{
    @Get('sante')
    sante()
    {
        return { statut: 'ok', service: 'gateway' };
    }

    @Get()
    accueil()
    {
        return {
            service: 'Flapazon API Gateway',
            routes: ['/auth', '/produits', '/stocks', '/commandes'],
        };
    }
}