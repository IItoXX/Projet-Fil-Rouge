import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommandesService } from './commandes.service';
import { CreerCommandeDto } from './dto/creer-commande.dto';
import { JwtAuthGuard } from '../securite/jwt-auth.guard';
import { UtilisateurActuel } from '../securite/utilisateur-actuel.decorator';

@ApiTags('commandes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('commandes')
export class CommandesController
{
    constructor(private readonly commandesService: CommandesService)
    {
    }

    @Post()
    creer(@Body() creerCommandeDto: CreerCommandeDto, @UtilisateurActuel() utilisateur: any)
    {
        return this.commandesService.creer(creerCommandeDto, utilisateur.id);
    }

    @Get()
    lister(@UtilisateurActuel() utilisateur: any)
    {
        return this.commandesService.lister(utilisateur.id, utilisateur.role);
    }

    @Get(':id')
    trouver(@Param('id') id: string, @UtilisateurActuel() utilisateur: any)
    {
        return this.commandesService.trouverPourUtilisateur(id, utilisateur.id, utilisateur.role);
    }

    @Patch(':id/annuler')
    annuler(@Param('id') id: string, @UtilisateurActuel() utilisateur: any)
    {
        return this.commandesService.annuler(id, utilisateur.id, utilisateur.role);
    }
}