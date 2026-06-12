import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvenementsGateway } from './evenements.gateway';
import { EvenementsController } from './evenements.controller';
import { InterneGuard } from './interne.guard';

@Module({
    imports: [ConfigModule],
    controllers: [EvenementsController],
    providers: [EvenementsGateway, InterneGuard],
})
export class EvenementsModule
{
}