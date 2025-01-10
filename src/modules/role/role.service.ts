import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { GetRoleDto } from 'src/dto/role/get-role.dto';
import { Role } from 'src/entities/role.entity';
import {
  CreateRoleModel,
  EditRoleModel,
  FetchRoleModel,
  RoleCreatedModel,
  RoleEditedModel,
} from 'src/models/role.model';
import { RoleRepository } from 'src/repositories/role.repository';
import { FindOptionsWhere } from 'typeorm';
import { UserRoleService } from '../user/user-role.service';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getAll(): Promise<FetchRoleModel[]> {
    return this.roleRepository.getAll();
  }

  async createRole(
    createRoleModel: CreateRoleModel,
  ): Promise<RoleCreatedModel> {
    return this.roleRepository.createRole(createRoleModel);
  }

  async getRoleById(roleId: number): Promise<FetchRoleModel> {
    const role = await this.roleRepository.getRole(roleId);
    if (!role) {
      throw new NotFoundException(APP_MESSAGES.Role.ERROR_ROLE_NOT_FOUND);
    }
    return role;
  }
  async findByIds(roleIds: number[]) {
    const existingRoles = await this.roleRepository.findByIds(roleIds);
    return existingRoles;
  }

  async findByName(roleName: string): Promise<FetchRoleModel> {
    const where: FindOptionsWhere<Role> = {
      name: roleName,
    };
    return await this.roleRepository.findOneByCondition(where);
  }

  async deleteRole(roleId: number) {
    const role: FetchRoleModel = await this.roleRepository.getRole(roleId);
    if (!role) {
      throw new NotFoundException(APP_MESSAGES.Role.ERROR_ROLE_NOT_FOUND);
    }
    if (role.users && role.users.length) {
      throw new ConflictException(APP_MESSAGES.Role.ERROR_DELETED);
    }
    return this.roleRepository.deleteRole(roleId);
  }
  async updateRole(roleId: number, editRoleModel: EditRoleModel): Promise<RoleEditedModel> {
     return await this.roleRepository.updateRole(roleId, editRoleModel);
  }
}
