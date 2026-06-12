import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { RoleUtilisateur } from '../../utilisateurs/role.enum';

export class InscriptionDto
{
    @ApiProperty({ example: 'jose@flapazon.fr' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'testtest', minLength: 8 })
    @IsString()
    @MinLength(8)
    motDePasse: string;

    @ApiProperty({ example: 'Jose Dupont' })
    @IsString()
    nom: string;

    @ApiProperty({ enum: [RoleUtilisateur.CLIENT, RoleUtilisateur.VENDEUR], required: false })
    @IsOptional()
    @IsIn([RoleUtilisateur.CLIENT, RoleUtilisateur.VENDEUR])
    role?: RoleUtilisateur;
}