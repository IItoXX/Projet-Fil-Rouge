import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UtilisateursService } from '../utilisateurs/utilisateurs.service';
import { RoleUtilisateur } from '../utilisateurs/role.enum';
import { Utilisateur } from '../utilisateurs/utilisateur.entity';
import { InscriptionDto } from './dto/inscription.dto';
import { ConnexionDto } from './dto/connexion.dto';

@Injectable()
export class AuthService
{
    constructor(
        private readonly utilisateursService: UtilisateursService,
        private readonly jwtService: JwtService,
    )
    {
    }

    async inscription(inscriptionDto: InscriptionDto)
    {
        const existant = await this.utilisateursService.trouverParEmail(inscriptionDto.email);
        if (existant)
        {
            throw new ConflictException('Un compte existe deja avec cet email');
        }
        const role = inscriptionDto.role ?? RoleUtilisateur.CLIENT;
        const utilisateur = await this.utilisateursService.creer(
            inscriptionDto.email,
            inscriptionDto.motDePasse,
            inscriptionDto.nom,
            role,
        );
        return this.genererReponse(utilisateur);
    }

    async connexion(connexionDto: ConnexionDto)
    {
        const utilisateur = await this.utilisateursService.trouverParEmail(connexionDto.email);
        if (!utilisateur)
        {
            throw new UnauthorizedException('Identifiants invalides');
        }
        const motDePasseValide = await bcrypt.compare(connexionDto.motDePasse, utilisateur.motDePasse);
        if (!motDePasseValide)
        {
            throw new UnauthorizedException('Identifiants invalides');
        }
        return this.genererReponse(utilisateur);
    }

    async listerUtilisateurs()
    {
        const utilisateurs = await this.utilisateursService.listerTous();
        return utilisateurs.map((utilisateur) => this.nettoyer(utilisateur));
    }

    private genererReponse(utilisateur: Utilisateur)
    {
        const charge = { sub: utilisateur.id, email: utilisateur.email, role: utilisateur.role };
        return {
            accessToken: this.jwtService.sign(charge),
            utilisateur: this.nettoyer(utilisateur),
        };
    }

    private nettoyer(utilisateur: Utilisateur)
    {
        return {
            id: utilisateur.id,
            email: utilisateur.email,
            nom: utilisateur.nom,
            role: utilisateur.role,
            creeLe: utilisateur.creeLe,
        };
    }
}