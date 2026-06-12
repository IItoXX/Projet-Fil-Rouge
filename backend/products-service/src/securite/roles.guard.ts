import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CLE_ROLES } from './roles.decorator';
import { RoleUtilisateur } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate
{
    constructor(private readonly reflector: Reflector)
    {
    }

    canActivate(contexte: ExecutionContext): boolean
    {
        const rolesRequis = this.reflector.getAllAndOverride<RoleUtilisateur[]>(CLE_ROLES, [
            contexte.getHandler(),
            contexte.getClass(),
        ]);
        if (!rolesRequis || rolesRequis.length === 0)
        {
            return true;
        }
        const requete = contexte.switchToHttp().getRequest();
        return rolesRequis.includes(requete.user.role);
    }
}