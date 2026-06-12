import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { InscriptionDto } from './dto/inscription.dto';
import { ConnexionDto } from './dto/connexion.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UtilisateurActuel } from './utilisateur-actuel.decorator';
import { RoleUtilisateur } from '../utilisateurs/role.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController
{
    constructor(private readonly authService: AuthService)
    {
    }

    @Post('inscription')
    inscription(@Body() inscriptionDto: InscriptionDto)
    {
        return this.authService.inscription(inscriptionDto);
    }

    @Post('connexion')
    connexion(@Body() connexionDto: ConnexionDto)
    {
        return this.authService.connexion(connexionDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profil')
    profil(@UtilisateurActuel() utilisateur: any)
    {
        return utilisateur;
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleUtilisateur.ADMIN)
    @Get('utilisateurs')
    lister()
    {
        return this.authService.listerUtilisateurs();
    }
}