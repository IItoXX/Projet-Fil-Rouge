import { PartialType } from '@nestjs/swagger';
import { CreerProduitDto } from './creer-produit.dto';

export class ModifierProduitDto extends PartialType(CreerProduitDto)
{
}