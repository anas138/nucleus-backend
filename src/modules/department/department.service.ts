import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Department } from 'src/entities/department.entity';
import { DepartmentRepository } from 'src/repositories/department.repository';
import { UserService } from '../user/user.service';
import { APP_MESSAGES, RecordStatus } from 'src/common/enums/enums';
import { SubDepartmentService } from '../sub-department/sub-department.service';
import { FetchDepartmentModel } from 'src/models/department.model';

@Injectable()
export class DepartmentService extends BaseService<Department> {
  constructor(
    private readonly departmentRepository: DepartmentRepository,
    private readonly userService: UserService,
    private readonly subDepartmentService: SubDepartmentService,
  ) {
    super(departmentRepository);
  }

  async ifValidRemove(departmentId: number): Promise<FetchDepartmentModel> {
    const user = await this.userService.findByDepartmentId(departmentId);
    if (user) {
      throw new ConflictException(
        APP_MESSAGES.DEPARTMENT.ERROR_DELETE_USER_EXIST,
      );
    }
    const subDepartment = await this.subDepartmentService.findByDepartmentId(
      departmentId,
    );

    if (subDepartment) {
      throw new ConflictException(
        APP_MESSAGES.DEPARTMENT.ERROR_DELETE_SUB_DEPARTMENT_EXIST,
      );
    }
    const department = await this.findById({ id: departmentId });
    if (!department) {
      throw new NotFoundException(
        APP_MESSAGES.DEPARTMENT.ERROR_DEPARTMENT_NOT_FOUND,
      );
    }
    return this.remove(department);
  }

  async deleteDepartment(departmentId: number) {
    const department: Department =
      await this.departmentRepository.findByCondition(
        { id: departmentId },
        null,
        ['users', 'sub_departments'],
      );
    if (!department) {
      throw new NotFoundException(
        APP_MESSAGES.DEPARTMENT.ERROR_DEPARTMENT_NOT_FOUND,
      );
    }

    if (
      (department.users && department.users.length) ||
      (department.sub_departments && department.sub_departments.length)
    ) {
      throw new ConflictException(APP_MESSAGES.DEPARTMENT.ERROR_DELETED);
    }
    return this.departmentRepository.deleteDepartment(department);
  }

  async engineeringSubDepartment() {
    // return this.departmentRepository.findByCondition(
    //   {
    //     name: 'Engineering',
    //   },
    //   null,
    //   ['sub_departments', 'sub_departments.users'],
    // );
    return this.departmentRepository.engineeringSubDepartment();
  }
}
