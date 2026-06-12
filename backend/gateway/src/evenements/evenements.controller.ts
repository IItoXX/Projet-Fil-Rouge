import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EvenementsGateway } from './evenements.gateway';
import { InterneGuard } from './interne.guard';

@Controller('evenements')
@UseGuards(InterneGuard)
export class EvenementsController
{
    constructor(private readonly evenementsGateway: EvenementsGateway)
    {
    }

    @Post()
    publier(@Body() corps: { type: string; donnee: unknown })
    {
        this.evenementsGateway.diffuser(corps.type, corps.donnee);
        return { diffuse: true };
    }
}