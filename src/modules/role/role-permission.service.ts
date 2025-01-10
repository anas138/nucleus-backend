import { Injectable, NotFoundException } from '@nestjs/common';
import { APP_MESSAGES } from 'src/common/enums/enums';
import {
  RolePermissionModel,
  UpdateRolePermissionsModel,
} from 'src/models/role-permission.model';
import { FetchRoleModel } from 'src/models/role.model';
import { RoleRepository } from 'src/repositories/role.repository';
import { PermissionService } from '../permission/permission.service';
import { FetchPermissionModel } from 'src/models/permission.model';

@Injectable()
export class RolePermissionService {
  constructor(
    private roleRepository: RoleRepository,
    private permissionService: PermissionService,
  ) { }

  async getRolePermissions(roleId: number): Promise<FetchPermissionModel[]> {
    return this.roleRepository.getRolePermissions(roleId);
  }
  async updateRolePermissions(
    roleId: number,
    updateRolePermissionsModel: UpdateRolePermissionsModel,
  ): Promise<RolePermissionModel> {
    const { permissionIds } = updateRolePermissionsModel;

    const role: FetchRoleModel = await this.roleRepository.getRole(roleId);

    if (!role) {
      throw new Error("Role doesn't exist");
    }
    let newPermissions = [];
    if (permissionIds.length > 0) {
      newPermissions = await this.permissionService.findByIds(permissionIds);
      if (newPermissions.length != permissionIds.length) {
        throw new NotFoundException(
          APP_MESSAGES.RolePermission.ERROR_SOME_PERMISSIONS_NOT_FOUND,
        );
      }
    }
    return this.roleRepository.updateRolePermission(role, newPermissions);
  }
  async getRoleRemainingPermissions(roleId: number) {
    const existingPermissions = await this.getRolePermissions(roleId);
    const allPermissions = await this.permissionService.getAll();

    const remainingPermissions = allPermissions
      .filter((permission) => {
        if (
          !existingPermissions.some(
            (existingPerm) => existingPerm.id === permission.id,
          )
        ) {
          return true;
        }
        return false;
      })
      .map((remainingPermission) => {
        return {
          id: remainingPermission.id,
          name: remainingPermission.name,
        };
      });
    return remainingPermissions;
  }
}
