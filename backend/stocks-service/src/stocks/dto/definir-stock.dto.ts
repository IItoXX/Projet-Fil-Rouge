import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class DefinirStockDto
{
    @ApiProperty({ example: '6a2bbe5237632fe764f38aba' })
    @IsString()
    produitId: string;

    @ApiProperty({ example: 50 })
    @IsInt()
    @Min(0)
    quantite: number;
}