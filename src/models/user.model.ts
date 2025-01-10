import { RecordStatus, UserType } from 'src/common/enums/enums';
import { Department } from 'src/entities/department.entity';
import { Permission } from 'src/entities/permission.entity';
import { Region } from 'src/entities/region.entity';
import { Role } from 'src/entities/role.entity';
import { Segment } from 'src/entities/segment.entity';
import { SubDepartment } from 'src/entities/sub-department.entity';
import { User } from 'src/entities/user.entity';

export class CreateUserModel {
  id?: number;
  username: string;
  password: string;
  full_name: string;
  email: string;
  profile_picture?: string;
  personal_mobile: string;
  official_mobile: string;
  role_ids?: number[];
  roles?: Role[];
  segment_ids?: number[];
  region_ids?: number[];
  regions?: Region[];
  department_id?: number;
  designation_id?: number;
  sub_department_id?: number;
  permission_ids?: number[];
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
  ms_org_email?: string;
  sub_department_ids?: number[];
}

export class UserCreatedModel {
  id: number;
  username: string;
  password?: string;
  full_name: string;
  email: string;
  profile_picture: string;
  personal_mobile: string;
  official_mobile: string;
  // roles?: Role[];
  // permissions?: Permission[];
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
  sub_department_id?: number;
  department_id?: number;
}

export class FetchUserModel {
  id: number;
  password?: string;
  username: string;
  full_name: string;
  email: string;
  profile_picture: string;
  personal_mobile: string;
  official_mobile: string;
  record_status: RecordStatus;
  sub_department_id?: number;
  roles?: Role[];
  permissions?: Permission[];
  designation?: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  };
  sub_department?: {
    id: number;
    name: string;
  };
  user_type: UserType;
  regions: any[];
  segments: Segment[];
  reporting_to_role: number;
  reporting_to_user: number;
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
  email_activate?: boolean;
  sms_activate?: boolean;
  notification_activate?: boolean;
  checkPermission?: (permission: string) => Permission | undefined;
}

export class FetchUserDepartment {
  id: number;
  department: string;
}

export class UpdateUserModel {
  username?: string;
  password?: string;
  full_name?: string;
  email?: string;
  profile_picture?: string;
  personal_mobile?: string;
  official_mobile?: string;
  role_ids?: number[];
  roles?: Role[];
  regions?: Region[];
  segment_ids?: number[];
  region_ids?: number[];
  department_id?: number;
  designation_id?: number;
  sub_department_id?: number;
  permission_ids?: number[];
  created_by?: number;
  updated_by?: number;
  last_password_changed?: Date;
  last_login?: Date;
  email_activate?: boolean;
  sms_activate?: boolean;
  notification_activate?: boolean;
  ms_org_email?: string;
  sub_department_ids?: number[];
}

export class UpdatedUserModel {
  username?: string;
  full_name?: string;
  email?: string;
  profile_picture?: string;
  personal_mobile?: string;
  official_mobile?: string;
  created_by?: number;
  updated_by?: number;
}

export class SimpleFetchUser {
  id: number;
  username?: string;
  full_name?: string;
  email?: string;
  user_type: UserType;
}

export const simpleFetchUserTransformer = (user: User): SimpleFetchUser => {
  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    email: user.email,
    user_type: user.user_type,
  };
};
