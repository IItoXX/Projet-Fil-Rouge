import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class MouvementStockDto
{
    @ApiProperty({ example: '6a2bbe5237632fe764f38aba' })
    @IsString()
    produitId: string;

    @ApiProperty({ example: '52060840-07c6-462d-8245-3ab50de12f68' })
    @IsString()
    magasinId: string;

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    quantite: number;
}