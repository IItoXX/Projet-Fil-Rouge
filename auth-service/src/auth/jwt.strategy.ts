import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UtilisateursService } from '../utilisateurs/utilisateurs.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    constructor(
        configService: ConfigService,
        private readonly utilisateursService: UtilisateursService,
    )
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(charge: { sub: string; email: string; role: string })
    {
        const utilisateur = await this.utilisateursService.trouverParId(charge.sub);
        if (!utilisateur)
        {
            throw new UnauthorizedException();
        }
        return { id: utilisateur.id, email: utilisateur.email, role: utilisateur.role };
    }
}