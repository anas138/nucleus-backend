import { Injectable } from '@nestjs/common';
import { RolePermissionService } from 'src/modules/role/role-permission.service';

@Injectable()
export class RolePermissionSeeder {
  constructor(private readonly rolePermissionService: RolePermissionService) {}
  async seed(roleId: number, permissionIds: Array<number>): Promise<void> {
    if (roleId && permissionIds.length) {
      try {
        const existingPermissionsIds = (
          await this.rolePermissionService.getRolePermissions(roleId)
        ).map((permission) => {
          return permission.id;
        });
        
        await this.rolePermissionService.updateRolePermissions(roleId, {
          permissionIds: [...permissionIds, ...existingPermissionsIds],
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  }
}
