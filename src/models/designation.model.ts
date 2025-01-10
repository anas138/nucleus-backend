import { Role } from 'src/entities/role.entity';
import { SubDepartment } from 'src/entities/sub-department.entity';
import { User } from 'src/entities/user.entity';

export class DesignationCreatedModel {
  name: string;
  created_by?: number;
  updated_by?: number;
}

export class FetchDesignationModel {
  id: number;
  name: string;
  roles?: Role[];
  sub_departments?: SubDepartment[];
  users?: User[];
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
}
