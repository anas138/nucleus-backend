import { Permission } from 'src/entities/permission.entity';
import { User } from 'src/entities/user.entity';

export class CreateRoleModel {
  name: string;
  description?: string;
  created_by?: number;
  updated_by?: number;
}

export class EditRoleModel {
  name: string;
  description?: string;
  created_by?: number;
  updated_by?: number;
}

export class RoleCreatedModel {
  id?: number;
  name: string;
  description?: string;
  created_by?: number;
  updated_by?: number;
}

export class RoleEditedModel {
  id?: number;
  name: string;
  description?: string;
  created_by?: number;
  updated_by?: number;
}

export class FetchRoleModel {
  id?: number;
  name: string;
  description?: string;
  created_by?: number;
  updated_by?: number;
  permissions?: Permission[];
  users?: User[];
}
