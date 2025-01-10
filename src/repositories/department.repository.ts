import { BaseAbstractRepository } from './base/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from 'src/entities/department.entity';
import { Role } from 'src/entities/role.entity';
import { IDepartmentRepository } from 'src/interfaces/department.repository.interface';
import { FetchDepartmentModel } from 'src/models/department.model';
import { RecordStatus } from 'src/common/enums/enums';

export class DepartmentRepository
  extends BaseAbstractRepository<Department>
  implements IDepartmentRepository
{
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {
    super(departmentRepository);
  }
  async updateDepartmentRole(
    department: Department,
    roles: Role[],
  ): Promise<Department> {
    department.roles = [...roles];
    try {
      const result = this.departmentRepository.save(department);
      return result;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async getDepartmentRoles(
    departmentId: number,
  ): Promise<FetchDepartmentModel[]> {
    const department = await this.departmentRepository.findOne({
      where: {
        id: departmentId,
      },
      relations: ['roles'],
    });
    const { roles } = department;
    return roles;
  }

  async deleteDepartment(department: Department) {
    return this.departmentRepository.delete(department.id);
  }

  async engineeringSubDepartment() {
    try {
      const query = await this.departmentRepository
        .createQueryBuilder('dep')
        .leftJoinAndSelect('dep.sub_departments', 'sub_departments')
        .leftJoinAndSelect('sub_departments.users', 'users')
        .where('users.user_type =:userType', { userType: 'GROUP' })
        .andWhere('users.record_status  =:RecordStatus', {
          RecordStatus: RecordStatus.ACTIVE,
        })
        .getOne();

      return query;
    } catch (error) {
      return error;
    }
  }
}
