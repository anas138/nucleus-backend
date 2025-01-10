import { Injectable, NotFoundException } from '@nestjs/common';
import { FetchPermissionModel } from 'src/models/permission.model';
import {
  FetchUserPermissionsModel,
  UpdateUserPermissionsModel,
  UserPermissionsModel,
} from 'src/models/user-permissions.model';
import { UserRepository } from 'src/repositories/user.repository';
import { PermissionService } from '../permission/permission.service';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { Permission } from 'src/entities/permission.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserPermissionService {
  constructor(
    private userRepository: UserRepository,
    private permissionService: PermissionService,
  ) {}

  async getUserPermissions(
    userId: number,
  ): Promise<FetchUserPermissionsModel[]> {
    const permissions: FetchPermissionModel[] =
      await this.userRepository.getUserPermissions(userId);

    const transformedPermissions = permissions.map((permission) => {
      return {
        id: permission.id,
        name: permission.name,
      };
    });
    return transformedPermissions;
  }
  async getRemainingUserPermissions(
    userId: number,
  ): Promise<FetchUserPermissionsModel[]> {
    const userData: any = await this.userRepository.findById(userId);
    const additionalPermissions = userData.permissions;
    const rolePermissions = this.getPermissionsAttachedWithRoles(userData);
    const existingPermissions = [...additionalPermissions, ...rolePermissions];
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

  doesAllPermissionsExist(
    foundPermissions: Permission[],
    incomingPermissions: number[],
  ) {
    if (foundPermissions.length != incomingPermissions.length) {
      throw new NotFoundException(
        APP_MESSAGES.Permission.ERROR_SOME_PERMISSIONS_NOT_FOUND,
      );
    }
    return true;
  }

  async updateUserPermissions(
    userId: number,
    updateUserPermissionModel: UpdateUserPermissionsModel,
  ): Promise<UserPermissionsModel> {
    const { permissionIds } = updateUserPermissionModel;
    const user: User = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(APP_MESSAGES.User.ERROR_USER_NOT_FOUND);
    }
    const permissionsAttachedWithRole =
      this.getPermissionsAttachedWithRoles(user);
    const overlappingPermissions =
      this.getPermissionIdsOverlappingWithRolePermissions(
        permissionsAttachedWithRole,
        permissionIds,
      );
    if (overlappingPermissions.length) {
      throw new Error(
        APP_MESSAGES.UserPermission.ERROR_PERMISSIONS_ATTACHED_WITH_ROLE,
      );
    }
    let updatedUser: User;
    if (permissionIds.length == 0) {
      updatedUser = await this.userRepository.updateUserPermissions(user, []);
      const updatedPermissionNames = updatedUser.permissions.map(
        (permission) => permission.name,
      );
      return { permissions: updatedPermissionNames };
    }
    const newUserPermissions = await this.permissionService.findByIds(
      permissionIds,
    );
    if (this.doesAllPermissionsExist(newUserPermissions, permissionIds)) {
      const updatedUser = await this.userRepository.updateUserPermissions(
        user,
        newUserPermissions,
      );
      const updatedPermissionNames = updatedUser.permissions.map(
        (permission) => permission.name,
      );
      return { permissions: updatedPermissionNames };
    }
    return;
  }

  getPermissionIdsOverlappingWithRolePermissions(
    permissionsAttachedWithRole,
    permissionIds,
  ) {
    return permissionsAttachedWithRole.filter((permission) => {
      const { id } = permission;
      if (permissionIds.includes(id)) {
        return true;
      }
    });
  }
  getPermissionsAttachedWithRoles(user: User) {
    const rolePermissions: Array<Array<object>> = user.roles.map((role) => {
      const permissions = role.permissions.map((permission) => {
        return { id: permission.id, name: permission.name };
      });
      return permissions;
    });

    const flattenedRolePermissions = rolePermissions.flat(1);
    const uniqueRolePermissions = [...new Set(flattenedRolePermissions)];
    return uniqueRolePermissions;
  }

  async getPermissionsOfPermissionIds(permissionIds) {
    let permissions: FetchPermissionModel[];
    for (let permissionId of permissionIds) {
      const permission = await this.permissionService.getPermissionById(
        permissionId,
      );
      if (!permission) {
        throw new Error(APP_MESSAGES.Permission.ERROR_PERMISSION_NOT_FOUND);
      }
      permissions.push(permission);
    }
    return permissions;
  }
}
