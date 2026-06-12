import { SetMetadata } from '@nestjs/common';
import { RoleUtilisateur } from '../utilisateurs/role.enum';

export const CLE_ROLES = 'roles';

export const Roles = (...roles: RoleUtilisateur[]) => SetMetadata(CLE_ROLES, roles);