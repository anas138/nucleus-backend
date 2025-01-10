import { CreateRoleDto } from 'src/dto/role/create-role.dto';
import { Permission } from 'src/entities/permission.entity';
import { FetchPermissionModel } from 'src/models/permission.model';
import { RolePermissionModel } from 'src/models/role-permission.model';
import { FetchRoleModel, RoleCreatedModel } from 'src/models/role.model';

export interface IRoleRepository {
  createRole(
    createRoleDto: CreateRoleDto,
  ): Promise<RoleCreatedModel | undefined>;

  updateRolePermission(
    role: FetchRoleModel,
    permissions: Permission[],
  ): Promise<RolePermissionModel>;

  getRolePermissions(roleId: number): Promise<FetchPermissionModel[]>;

  getRole(roleId: number): Promise<FetchRoleModel>;

  getAll(): Promise<FetchRoleModel[]>;
}
