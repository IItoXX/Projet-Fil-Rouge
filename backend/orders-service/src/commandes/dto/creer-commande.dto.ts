import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { LigneCommandeDto } from './ligne-commande.dto';

export class CreerCommandeDto
{
    @ApiProperty({ type: [LigneCommandeDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => LigneCommandeDto)
    lignes: LigneCommandeDto[];
}