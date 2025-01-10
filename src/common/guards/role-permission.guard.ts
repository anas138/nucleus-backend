import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from 'src/entities/permission.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class RolePermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    const request = context.switchToHttp().getRequest();
    if (requiredPermissions.includes('public')) {
      return true;
    }
    const user: User = request.user;
    if (!user) {
      return false;
    }
    const { permissions: existingPermission } = user;
    const hasRequiredPermission = existingPermission.some(
      (existingPermission) =>
        requiredPermissions.includes(existingPermission.name),
    );
    return hasRequiredPermission;
  }
}
