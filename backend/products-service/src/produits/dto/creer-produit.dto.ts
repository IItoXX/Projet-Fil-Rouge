import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreerProduitDto
{
    @ApiProperty({ example: 'Casque audio sans fil' })
    @IsString()
    @MinLength(2)
    nom: string;

    @ApiProperty({ example: 'Casque bluetooth avec reduction de bruit', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 79.99 })
    @IsNumber()
    @IsPositive()
    prix: number;

    @ApiProperty({ example: 'electronique' })
    @IsString()
    categorie: string;

    @ApiProperty({ example: 'https://exemple.fr/casque.jpg', required: false })
    @IsOptional()
    @IsString()
    imageUrl?: string;
}