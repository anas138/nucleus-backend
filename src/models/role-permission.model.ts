import { Permission } from 'src/entities/permission.entity';

export class RolePermissionModel {
  permissions: Permission[];
}

export class UpdateRolePermissionsModel {
  permissionIds: number[];
}
