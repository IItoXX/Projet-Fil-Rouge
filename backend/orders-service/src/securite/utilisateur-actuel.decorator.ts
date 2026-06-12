import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UtilisateurActuel = createParamDecorator((donnee: unknown, contexte: ExecutionContext) =>
{
    const requete = contexte.switchToHttp().getRequest();
    return requete.user;
});