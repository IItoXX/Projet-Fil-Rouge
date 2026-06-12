import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from './utilisateur.entity';
import { UtilisateursService } from './utilisateurs.service';

@Module({
    imports: [TypeOrmModule.forFeature([Utilisateur])],
    providers: [UtilisateursService],
    exports: [UtilisateursService],
})
export class UtilisateursModule
{
}