import { Injectable, NotFoundException } from '@nestjs/common';
import { APP_MESSAGES } from 'src/common/enums/enums';
import {
  FetchUserRolesModel,
  UpdateUserRolesModel,
  UserRolesModel,
} from 'src/models/user-roles.model';
import { UserRepository } from 'src/repositories/user.repository';
import { RoleService } from '../role/role.service';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class UserRoleService {
  constructor(
    private userRepository: UserRepository,
    private roleService: RoleService,
  ) {}

  async getUserRoles(userId: number): Promise<FetchUserRolesModel[]> {
    const roles = await this.userRepository.getUserRoles(userId);
    return roles.map((role) => {
      return { id: role.id, name: role.name };
    });
  }

  async getRemainingUserRoles(userId: number): Promise<FetchUserRolesModel[]> {
    const existingRoles = await this.getUserRoles(userId);
    const allRoles = await this.roleService.getAll();

    const remainingRoles = allRoles
      .filter((role) => {
        if (
          !existingRoles.some((existingRole) => existingRole.id === role.id)
        ) {
          return true;
        }
        return false;
      })
      .map((remainingRole) => {
        return {
          id: remainingRole.id,
          name: remainingRole.name,
        };
      });
    return remainingRoles;
  }

  doesAllRolesExist(foundRoles: Role[], incomingRoles: number[]) {
    if (foundRoles.length != incomingRoles.length) {
      throw new NotFoundException(APP_MESSAGES.Role.ERROR_SOME_ROLES_NOT_FOUND);
    }
    return true;
  }
  async updateUserRoles(
    userId: number,
    updateUserRolesModel: UpdateUserRolesModel,
  ): Promise<UserRolesModel> {
    const { roleIds } = updateUserRolesModel;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(APP_MESSAGES.User.ERROR_USER_NOT_FOUND);
    }
    if (roleIds.length == 0) {
      const updatedUser = await this.userRepository.updateUserRoles(user, []);
      const updatedRoleNames = updatedUser.roles.map((role) => role.name);
      return { roles: updatedRoleNames };
    }

    const newUserRoles = await this.roleService.findByIds(roleIds);
    if (this.doesAllRolesExist(newUserRoles, roleIds)) {
      const updatedUser = await this.userRepository.updateUserRoles(
        user,
        newUserRoles,
      );
      const updatedRoleNames = updatedUser.roles.map((role) => role.name);
      return { roles: updatedRoleNames };
    }
    return;
  }

  async getRolesOfRoleIds(roleIds) {
    let roles = [];
    for (let roleId of roleIds) {
      const role = await this.roleService.getRoleById(roleId);
      if (!role) {
        throw new Error(APP_MESSAGES.Role.ERROR_ROLE_NOT_FOUND);
      }
      roles.push(role);
    }
    return roles;
  }
}
