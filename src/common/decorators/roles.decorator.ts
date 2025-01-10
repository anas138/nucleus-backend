import { SetMetadata } from '@nestjs/common';

export const RolesMetaDeta = (...roles: string[]) => SetMetadata('roles', roles);
