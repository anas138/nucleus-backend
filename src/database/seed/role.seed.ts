import { Injectable } from '@nestjs/common';
import { CreateRoleModel } from 'src/models/role.model';
import { RoleService } from 'src/modules/role/role.service';

@Injectable()
export class RoleSeeder {
  constructor(private readonly roleService: RoleService) {}
  async seed(): Promise<number> {
    const roleData: CreateRoleModel = {
      name: 'SUPER_ADMIN',
      description: 'This is super admin',
    };

    try {
      const { id } = await this.roleService.createRole(roleData);
      return id;
    } catch (error) {
      if (error.message === 'Role already exist')
        return await (
          await this.roleService.findByName(roleData.name)
        ).id;
      
    }
  }
}
