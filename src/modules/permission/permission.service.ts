import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { APP_MESSAGES } from 'src/common/enums/enums';
import {
  CreatePermissionModel,
  FetchPermissionModel,
  PermissionCreatedModel,
} from 'src/models/permission.model';
import { PermissionRepository } from 'src/repositories/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getAll(): Promise<FetchPermissionModel[]> {
    return this.permissionRepository.getAll();
  }

  async createPermission(
    createPermissionModel: CreatePermissionModel,
  ): Promise<PermissionCreatedModel> {
    return this.permissionRepository.createPermission(createPermissionModel);
  }
  async findByIds(permissionIds: number[]) {
    const existingPermissions = await this.permissionRepository.findByIds(
      permissionIds,
    );
    return existingPermissions;
  }
  async getPermissionById(permissionId: number): Promise<FetchPermissionModel> {
    const permission = this.permissionRepository.getPermission(permissionId);
    if (!permission) {
      throw new NotFoundException(
        APP_MESSAGES.Permission.ERROR_PERMISSION_NOT_FOUND,
      );
    }
    return permission;
  }

  async deletePermission(permissionId: number) {
    const permission: FetchPermissionModel =
      await this.permissionRepository.getPermission(permissionId);
    if (!permission) {
      throw new NotFoundException(
        APP_MESSAGES.Permission.ERROR_PERMISSION_NOT_FOUND,
      );
    }
    if (permission.users && permission.users.length) {
      throw new ConflictException(APP_MESSAGES.Permission.ERROR_DELETED);
    }

    return this.permissionRepository.deletePermission(permission);
  }
}
