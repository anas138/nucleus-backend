import { Role } from 'src/entities/role.entity';

export class FetchUserRolesModel {
  name: string;
  id: number;
}

export class CreateUserRolesModel {
  roleIds: number[];
}
export class UpdateUserRolesModel {
  roleIds: number[];
}
export class UserRolesModel {
  roles: string[];
}
export class DeleteUserRolesModel {
  roleIds: number[];
}
