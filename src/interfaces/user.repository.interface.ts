import {
  CreateUserModel,
  FetchUserModel,
  UpdateUserModel,
  UpdatedUserModel,
  UserCreatedModel,
} from 'src/models/user.model';
import { FetchPermissionModel } from 'src/models/permission.model';
import { FetchRoleModel } from 'src/models/role.model';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { UserRolesModel } from 'src/models/user-roles.model';
import { Permission } from 'src/entities/permission.entity';
import { UserPermissionsModel } from 'src/models/user-permissions.model';

export interface IUserRepository {
  findByUsername(username: string): Promise<FetchUserModel | undefined>;

  findById(id: number): Promise<FetchUserModel>;

  createUser(
    createUserModel: CreateUserModel,
  ): Promise<UserCreatedModel | undefined>;

  updateUserRoles(user: User, roles: Role[]): Promise<User>;

  updateUserPermissions(user: User, permissions: Permission[]): Promise<User>;

  getUserPermissions(userId: number): Promise<FetchPermissionModel[]>;

  getUserRoles(userId: number): Promise<FetchRoleModel[]>;

  updateUser(
    userId: number,
    userModel: UpdateUserModel,
  ): Promise<UpdatedUserModel>;
}
