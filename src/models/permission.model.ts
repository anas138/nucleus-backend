import { User } from 'src/entities/user.entity';

//request
export class CreatePermissionModel {
  name: string;
  description?: string;
  created_by?: number;
  updated_by?: number;
}

//response
export class PermissionCreatedModel {
  id?: number;
  name: string;
  description?: string;
  created_by?: number;
  updated_by?: number;
}

export class FetchPermissionModel {
  id?: number;
  name: string;
  description?: string;
  created_by?: number;
  updated_by?: number;
  users?: User[];
  created_at?: Date;
  updated_at?: Date;
}
