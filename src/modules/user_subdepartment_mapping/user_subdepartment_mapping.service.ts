import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { UserSubdepartmentMapping } from 'src/entities/user_subdepartment_mapping.entity';
import { UserSubDepartmentMappingRepository } from './user_subdepartment_mapping.repository';
import { In, Not, QueryRunner } from 'typeorm';
import {
  APP_PERMISSIONS,
  MapTroubleTicketPriorityToPermission,
  MapTroubleTicketPriorityToPermissionOverTAT,
} from 'src/common/enums/enums';

@Injectable()
export class USerSubDepartmentMappingService extends BaseService<UserSubdepartmentMapping> {
  constructor(private readonly repo: UserSubDepartmentMappingRepository) {
    super(repo);
  }

  private _userRelations: string[] = [
    'user',
    'user.roles',
    'user.roles.permissions',
    'user.permissions',
  ];

  async createOrUpdate(
    subDepartment: number[],
    userId: number,
    departmentId: number,
    createdBy: number,
    queryRunner: QueryRunner,
  ) {
    let cond = null;
    cond = { user_id: userId };

    if (subDepartment.length) {
      cond = { ...cond, sub_department_id: Not(In([subDepartment])) };
    }
    await this.deleteRecord(
      {
        ...cond,
      },
      queryRunner.manager,
    );

    const exists = await this.findAll({
      where: { sub_department_id: In(subDepartment), user_id: userId },
    });

    const isExistsSet = new Set(exists.map((ex) => ex.sub_department_id));

    const newRecords = subDepartment
      .filter((sub) => !isExistsSet.has(sub))
      .map((sub) => {
        return {
          user_id: userId,
          sub_department_id: sub,
          department_id: departmentId,
          created_by: createdBy,
        };
      });

    const saveData = await Promise.all(
      newRecords.map(
        async (rec) => await this.create(rec, queryRunner.manager),
      ),
    );

    if (saveData) {
      return true;
    }
  }

  /**
   *
   * @param subdepartmentId
   * @returns
   * @description Fetch user emails against subdepartment_id |
   */
  async getUserEmailsBySubDeptAndPermission(
    subdepartmentId: number,
    permission: string,
  ): Promise<string[]> {
    const usersSubDeptMappingList =
      await this.repo.findUsersBySubDeptAndPermission(
        subdepartmentId,
        permission,
      );
    if (usersSubDeptMappingList && usersSubDeptMappingList.length) {
      return usersSubDeptMappingList.map((item) => item.user.email);
    }
    return [];
  }
}
