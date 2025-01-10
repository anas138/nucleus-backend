import { Injectable } from '@nestjs/common';
import { CreateUserModel } from 'src/models/user.model';
import { RoleService } from 'src/modules/role/role.service';
import { UserRoleService } from 'src/modules/user/user-role.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class UserSeeder {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService,
  ) {}
  async seed(): Promise<void> {
    const userData: CreateUserModel = {
      username: 'super.admin',
      password: 'Password1',
      full_name: 'super admin',
      email: 'super.admin@tw1.com',
      personal_mobile: '03111111111',
      official_mobile: '03111111111',
    };
    const roleName = 'SUPER_ADMIN';
    try {
      const { id: userId } = await this.userService.createUser(userData);
      const { id: roleId } = await this.roleService.findByName(roleName);
      await this.userRoleService.updateUserRoles(userId, {
        roleIds: [roleId],
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}
