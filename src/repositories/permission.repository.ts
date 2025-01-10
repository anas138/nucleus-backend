import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { Permission } from 'src/entities/permission.entity';
import { IPermissionRepository } from 'src/interfaces/permission.repository.interface';
import {
  CreatePermissionModel,
  FetchPermissionModel,
  PermissionCreatedModel,
} from 'src/models/permission.model';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async getAll(): Promise<FetchPermissionModel[]> {
    return this.permissionRepository.find();
  }

  async createPermission(
    createPermissionModel: CreatePermissionModel,
  ): Promise<PermissionCreatedModel> {
    const permission: PermissionCreatedModel =
      await this.permissionRepository.create(createPermissionModel);
    try {
      await this.permissionRepository.save(permission);
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        throw new ConflictException(
          APP_MESSAGES.Permission.ERROR_DUPLICATE_PERMISSION_NAME,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
    return permission;
  }

  async findByIds(permissionIds: number[]) {
    const existingPermissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.id IN (:...permissionIds)', { permissionIds })
      .getMany();

    return existingPermissions;
  }

  async getPermission(permissionId: number): Promise<FetchPermissionModel> {
    const permission = await this.permissionRepository.findOne({
      where: {
        id: permissionId,
      },
      relations: ['users'],
    });
    return permission;
  }

  async deletePermission(permission: Partial<Permission>) {
    return this.permissionRepository.delete(permission.id);
  }
}
