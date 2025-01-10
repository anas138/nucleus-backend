import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { IRoleRepository } from 'src/interfaces/role.repository.interface';
import { FetchPermissionModel } from 'src/models/permission.model';
import { RolePermissionModel } from 'src/models/role-permission.model';
import {
  CreateRoleModel,
  EditRoleModel,
  FetchRoleModel,
  RoleCreatedModel,
  RoleEditedModel,
} from 'src/models/role.model';
import { FindOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getAll(): Promise<FetchRoleModel[]> {
    return this.roleRepository.find();
  }

  async createRole(
    createRoleModel: CreateRoleModel,
  ): Promise<RoleCreatedModel> {
    const role: RoleCreatedModel = await this.roleRepository.create(
      createRoleModel,
    );
    try {
      await this.roleRepository.save(role);
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('Role already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return role;
  }

  async getRole(roleId: number): Promise<FetchRoleModel> {
    const role = await this.roleRepository.findOne({
      where: {
        id: roleId,
      },
      relations: ['permissions', 'users'],
    });
    return role;
  }
  async findByIds(roleIds: number[]) {
    const existingRoles = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .getMany();

    return existingRoles;
  }
  async getRolePermissions(roleId: number): Promise<FetchPermissionModel[]> {
    const roleData = await this.roleRepository.findOne({
      where: {
        id: roleId,
      },
      relations: ['permissions'],
    });
    const { permissions } = roleData;
    return permissions;
  }

  async updateRolePermission(
    role: FetchRoleModel,
    permissions: Permission[],
  ): Promise<RolePermissionModel> {
    role.permissions = [...permissions];
    try {
      const result = this.roleRepository.save(role);
      return result;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async findOneByCondition(
    where: FindOptionsWhere<Role>,
  ): Promise<FetchRoleModel> {
    return this.roleRepository.findOne({ where });
  }

  async deleteRole(roleId: number) {
    const options: FindOptionsWhere<Role> = {
      id: roleId,
    };
    return this.roleRepository.delete(options);
  }

  async updateRole(roleId: number, editRoleModel: EditRoleModel): Promise<RoleEditedModel> {
    const where: FindOptionsWhere<Role> = {
      id: roleId,
    };
    let role = await this.roleRepository.findOneBy(where);
    if (!role) {
      throw new NotFoundException(APP_MESSAGES.Role.ERROR_ROLE_NOT_FOUND);
    } else {
      role = { ...role, ...editRoleModel };
      return this.roleRepository.save(role);
    }
  }
}
