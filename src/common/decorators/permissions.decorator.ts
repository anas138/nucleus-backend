import { SetMetadata } from '@nestjs/common';

export const PermissionsMetadata = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
