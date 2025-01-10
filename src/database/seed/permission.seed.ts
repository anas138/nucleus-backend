import { Injectable } from '@nestjs/common';
import { CreatePermissionModel } from 'src/models/permission.model';
import { PermissionService } from 'src/modules/permission/permission.service';

@Injectable()
export class PermissionSeeder {
  constructor(private readonly permissionService: PermissionService) {}
  async seed(): Promise<Array<number>> {
    const permissionData: CreatePermissionModel[] = [
      {
        name: 'users-create',
      },
      {
        name: 'users-edit',
      },
      {
        name: 'users-acess',
      },
      {
        name: 'users-delete',
      },
      {
        name: 'permissions-create',
      },
      {
        name: 'permissions-access',
      },
      {
        name: 'permissions-edit',
      },
      {
        name: 'permissions-delete',
      },
      {
        name: 'department-create',
      },
      {
        name: 'department-edit',
      },
      {
        name: 'department-access',
      },
      {
        name: 'department-delete',
      },
      {
        name: 'subdepartment-create',
      },
      {
        name: 'subdepartment-access',
      },
      {
        name: 'subdepartment-delete',
      },
      {
        name: 'subdepartment-edit',
      },
      {
        name: 'designation-access',
      },
      {
        name: 'designation-create',
      },
      {
        name: 'designation-edit',
      },
      {
        name: 'designation-delete',
      },
      {
        name: 'role-access',
      },
      {
        name: 'role-create',
      },
      {
        name: 'role-edit',
      },
      {
        name: 'role-delete',
      },
      {
        name: 'userManagement-access',
      },
      {
        name: 'hrm-access',
      },
      {
        name: 'ip-alarms',
      },
      {
        name: 'ip-devices',
      },
      {
        name: 'ipAlarmConfig-create',
      },
      {
        name: 'ipAlarmConfig-edit',
      },
      {
        name: 'ipAlarmConfig-access',
      },
      {
        name: 'ip-devicesSync',
      },
      {
        name: 'ip-network',
      },
      {
        name: 'tx-alarms',
      },
      {
        name: 'tx-devices',
      },
      {
        name: 'tx-network',
      },
      {
        name: 'tx-devicesSync',
      },
      {
        name: 'txAlarmConfig-create',
      },
      {
        name: 'txAlarmConfig-edit',
      },
      {
        name: 'txAlarmConfig-access',
      },
    ];
    let permissionIds: Array<number> = [];
    for (const permission of permissionData) {
      try {
        const { id } = await this.permissionService.createPermission(
          permission,
        );
        permissionIds.push(id);
      } catch (error) {
        console.log(error.message, ' in permission seeder');
      }
    }
    return permissionIds;
  }
}
