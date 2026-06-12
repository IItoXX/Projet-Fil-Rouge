import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { EvenementsModule } from './evenements/evenements.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), EvenementsModule],
    controllers: [AppController],
})
export class AppModule
{
}