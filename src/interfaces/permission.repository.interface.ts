import {
  CreatePermissionModel,
  FetchPermissionModel,
  PermissionCreatedModel,
} from 'src/models/permission.model';

export interface IPermissionRepository {
  createPermission(
    createPermissionModel: CreatePermissionModel,
  ): Promise<PermissionCreatedModel | undefined>;

  getPermission(permissionId: number): Promise<FetchPermissionModel>;

  getAll(): Promise<FetchPermissionModel[]>;
}
