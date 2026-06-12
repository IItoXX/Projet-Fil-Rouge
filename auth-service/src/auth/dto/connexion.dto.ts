import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ConnexionDto
{
    @ApiProperty({ example: 'admin@flapazon.fr' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'testtest' })
    @IsString()
    motDePasse: string;
}