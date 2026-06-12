import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class LigneCommandeDto
{
    @ApiProperty({ example: '6a2bbe5237632fe764f38aba' })
    @IsString()
    produitId: string;

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    quantite: number;
}