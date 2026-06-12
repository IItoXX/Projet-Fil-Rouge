import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProduitsService } from './produits.service';
import { CreerProduitDto } from './dto/creer-produit.dto';
import { ModifierProduitDto } from './dto/modifier-produit.dto';
import { JwtAuthGuard } from '../securite/jwt-auth.guard';
import { RolesGuard } from '../securite/roles.guard';
import { Roles } from '../securite/roles.decorator';
import { UtilisateurActuel } from '../securite/utilisateur-actuel.decorator';
import { RoleUtilisateur } from '../securite/role.enum';

@ApiTags('produits')
@Controller('produits')
export class ProduitsController
{
    constructor(private readonly produitsService: ProduitsService)
    {
    }

    @Get()
    lister(@Query('categorie') categorie?: string, @Query('magasinId') magasinId?: string)
    {
        return this.produitsService.lister(categorie, magasinId);
    }

    @Get(':id')
    trouver(@Param('id') id: string)
    {
        return this.produitsService.trouverParId(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleUtilisateur.VENDEUR, RoleUtilisateur.ADMIN)
    @Post()
    creer(@Body() creerProduitDto: CreerProduitDto, @UtilisateurActuel() utilisateur: any)
    {
        return this.produitsService.creer(creerProduitDto, utilisateur.id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleUtilisateur.VENDEUR, RoleUtilisateur.ADMIN)
    @Patch(':id')
    modifier(@Param('id') id: string, @Body() modifierProduitDto: ModifierProduitDto, @UtilisateurActuel() utilisateur: any)
    {
        return this.produitsService.modifier(id, modifierProduitDto, utilisateur.id, utilisateur.role);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleUtilisateur.VENDEUR, RoleUtilisateur.ADMIN)
    @Delete(':id')
    supprimer(@Param('id') id: string, @UtilisateurActuel() utilisateur: any)
    {
        return this.produitsService.supprimer(id, utilisateur.id, utilisateur.role);
    }
}