export class FetchUserPermissionsModel {
  id: number;
  name: string;
}

export class CreateUserPermissionsModel {
  permissionIds: number[];
}

export class UpdateUserPermissionsModel {
  permissionIds: number[];
}

export class UserPermissionsModel {
  permissions: string[];
}

export class DeleteUserPermissionModel {
  permissionIds: number[];
}
