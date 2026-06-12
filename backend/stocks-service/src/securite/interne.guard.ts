import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InterneGuard implements CanActivate
{
    constructor(private readonly configService: ConfigService)
    {
    }

    canActivate(contexte: ExecutionContext): boolean
    {
        const requete = contexte.switchToHttp().getRequest();
        const jeton = requete.headers['x-internal-token'];
        if (jeton !== this.configService.getOrThrow<string>('INTERNAL_TOKEN'))
        {
            throw new UnauthorizedException('Acces interne refuse');
        }
        return true;
    }
}