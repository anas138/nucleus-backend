import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DepartmentRoleService } from './department-role.service';
import { DepartmentRepository } from 'src/repositories/department.repository';
import { RoleModule } from '../role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/entities/department.entity';
import { UserModule } from '../user/user.module';
import { SubDepartmentModule } from '../sub-department/sub-department.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    RoleModule,
    UserModule,
    SubDepartmentModule,
  ],
  providers: [DepartmentService, DepartmentRoleService, DepartmentRepository],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
