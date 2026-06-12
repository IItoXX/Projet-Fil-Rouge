import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { DefinirStockDto } from './dto/definir-stock.dto';
import { MouvementStockDto } from './dto/mouvement-stock.dto';
import { JwtAuthGuard } from '../securite/jwt-auth.guard';
import { RolesGuard } from '../securite/roles.guard';
import { InterneGuard } from '../securite/interne.guard';
import { Roles } from '../securite/roles.decorator';
import { UtilisateurActuel } from '../securite/utilisateur-actuel.decorator';
import { RoleUtilisateur } from '../securite/role.enum';

@ApiTags('stocks')
@Controller('stocks')
export class StocksController
{
    constructor(private readonly stocksService: StocksService)
    {
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    lister(@Query('produitId') produitId?: string, @Query('magasinId') magasinId?: string)
    {
        return this.stocksService.lister(produitId, magasinId);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleUtilisateur.VENDEUR, RoleUtilisateur.ADMIN)
    @Post()
    definir(@Body() definirStockDto: DefinirStockDto, @UtilisateurActuel() utilisateur: any)
    {
        return this.stocksService.definir(definirStockDto.produitId, utilisateur.id, definirStockDto.quantite);
    }

    @UseGuards(InterneGuard)
    @Post('decrementer')
    decrementer(@Body() mouvementStockDto: MouvementStockDto)
    {
        return this.stocksService.decrementer(mouvementStockDto.produitId, mouvementStockDto.magasinId, mouvementStockDto.quantite);
    }

    @UseGuards(InterneGuard)
    @Post('incrementer')
    incrementer(@Body() mouvementStockDto: MouvementStockDto)
    {
        return this.stocksService.incrementer(mouvementStockDto.produitId, mouvementStockDto.magasinId, mouvementStockDto.quantite);
    }
}