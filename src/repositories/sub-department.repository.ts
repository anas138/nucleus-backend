import { BaseAbstractRepository } from './base/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubDepartment } from 'src/entities/sub-department.entity';
import { ISubDepartmentRepository } from 'src/interfaces/sub-department.repository.interface';
import { FetchSubDepartmentModel } from 'src/models/sub-department.model';

export class SubDepartmentRepository
  extends BaseAbstractRepository<SubDepartment>
  implements ISubDepartmentRepository
{
  constructor(
    @InjectRepository(SubDepartment)
    private readonly subDepartmentRepository: Repository<SubDepartment>,
  ) {
    super(subDepartmentRepository);
  }

  async findByDepartmentId(
    departmentId: number,
  ): Promise<FetchSubDepartmentModel> {
    const subDepartment = await this.subDepartmentRepository
      .createQueryBuilder('subDepartment')
      .leftJoinAndSelect('subDepartment.department', 'department')
      .where('department.id = :departmentId', { departmentId })
      .getOne();
    return subDepartment;
  }

  async deleteSubDepartment(subDepartment: SubDepartment) {
    return this.subDepartmentRepository.delete(subDepartment.id);
  }
}
