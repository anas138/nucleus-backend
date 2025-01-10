import { Module } from '@nestjs/common';
import { SubDepartmentController } from './sub-department.controller';
import { SubDepartmentService } from './sub-department.service';
import { SubDepartmentRepository } from 'src/repositories/sub-department.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubDepartment } from 'src/entities/sub-department.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubDepartment]), UserModule],
  providers: [SubDepartmentService, SubDepartmentRepository],
  controllers: [SubDepartmentController],
  exports: [SubDepartmentService],
})
export class SubDepartmentModule {}
