import { BaseAbstractRepository } from './base/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from 'src/entities/department.entity';
import { Role } from 'src/entities/role.entity';
import { IDepartmentRepository } from 'src/interfaces/department.repository.interface';
import { FetchDepartmentModel } from 'src/models/department.model';
import { Designation } from 'src/entities/designation.entity';
import { IDesignationRepository } from 'src/interfaces/designation.repository.interface';

export class DesignationRepository
  extends BaseAbstractRepository<Designation>
  implements IDesignationRepository
{
  constructor(
    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
  ) {
    super(designationRepository);
  }
  async deleteDesignation(designation: Designation) {
    return this.designationRepository.delete(designation.id);
  }
}
