import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { BaseService } from 'src/common/services/base.service';
import { SubDepartment } from 'src/entities/sub-department.entity';
import { FetchSubDepartmentModel } from 'src/models/sub-department.model';
import { SubDepartmentRepository } from 'src/repositories/sub-department.repository';
import { UserService } from '../user/user.service';

@Injectable()
export class SubDepartmentService extends BaseService<SubDepartment> {
  constructor(
    private readonly userService: UserService,
    private readonly subDepartmentRepository: SubDepartmentRepository,
  ) {
    super(subDepartmentRepository);
  }
  async findByDepartmentId(
    departmentId: number,
  ): Promise<FetchSubDepartmentModel> {
    return this.subDepartmentRepository.findByDepartmentId(departmentId);
  }
  async ifValidRemove(departmentId: number): Promise<any> {
    const user = await this.userService.findByDepartmentId(departmentId);
    if (user) {
      throw new ConflictException(
        APP_MESSAGES.SUB_DEPARTMENT.ERROR_DELETE_USER_EXIST,
      );
    }
    const subDepartment = await this.findById({ id: departmentId });
    if (!subDepartment) {
      throw new NotFoundException(
        APP_MESSAGES.SUB_DEPARTMENT.ERROR_SUB_DEPARTMENT_NOT_FOUND,
      );
    }
    return this.remove(subDepartment);
  }

  async findAll(): Promise<any> {
    return this.subDepartmentRepository.findAll({
      relations: ['department'],
    });
  }

  async deleteSubDepartment(subDepartmentId: number) {
    const subDepartment: SubDepartment =
      await this.subDepartmentRepository.findByCondition(
        { id: subDepartmentId },
        null,
        ['users'],
      );
    if (!subDepartment) {
      throw new NotFoundException(
        APP_MESSAGES.SUB_DEPARTMENT.ERROR_SUB_DEPARTMENT_NOT_FOUND,
      );
    }

    if (subDepartment.users && subDepartment.users.length) {
      throw new ConflictException(
        APP_MESSAGES.SUB_DEPARTMENT.ERROR_DELETE_USER_EXIST,
      );
    }
    return this.subDepartmentRepository.deleteSubDepartment(subDepartment);
  }
}
