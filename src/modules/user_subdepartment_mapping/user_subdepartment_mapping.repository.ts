import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extend } from 'joi';
import { RecordStatus } from 'src/common/enums/enums';
import { UserSubdepartmentMapping } from 'src/entities/user_subdepartment_mapping.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class UserSubDepartmentMappingRepository extends BaseAbstractRepository<UserSubdepartmentMapping> {
  constructor(
    @InjectRepository(UserSubdepartmentMapping)
    private readonly repo: Repository<UserSubdepartmentMapping>,
  ) {
    super(repo);
  }

  private _userRelations: string[] = [
    'user',
    'user.roles',
    'user.roles.permissions',
    'user.permissions',
  ];

  async findUsersBySubdepartmentId(
    subdepartmentId: number,
  ): Promise<UserSubdepartmentMapping[]> {
    return this.findAllByCondition({
      sub_department_id: subdepartmentId,
      record_status: RecordStatus.ACTIVE,
    });
  }

  /**
   *
   * @param subDepartmentId
   * @param permission
   * @returns
   * @description Find all users against subdept (who have this subdept assigned in user-subdept-mapping table) and also have this specific Permission
   */
  async findUsersBySubDeptAndPermission(
    subDepartmentId: number,
    permission: string,
  ): Promise<UserSubdepartmentMapping[]> {
    return this.findAll({
      where: [
        {
          record_status: RecordStatus.ACTIVE,
          sub_department_id: subDepartmentId,
          user: {
            permissions: {
              name: permission,
            },
          },
        },
        {
          sub_department_id: subDepartmentId,
          user: {
            roles: {
              permissions: {
                name: permission,
              },
            },
          },
        },
      ],
      relations: this._userRelations,
    });
  }
}
