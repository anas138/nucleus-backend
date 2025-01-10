import { Module } from '@nestjs/common';
import { UserSubDepartmentMappingController } from './user_subdepartment_mapping.controller';
import { UserSubDepartmentMappingRepository } from './user_subdepartment_mapping.repository';
import { USerSubDepartmentMappingService } from './user_subdepartment_mapping.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubdepartmentMapping } from 'src/entities/user_subdepartment_mapping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSubdepartmentMapping])],
  controllers: [UserSubDepartmentMappingController],
  providers: [
    UserSubDepartmentMappingRepository,
    USerSubDepartmentMappingService,
  ],
  exports: [
    UserSubDepartmentMappingRepository,
    USerSubDepartmentMappingService,
  ],
})
export class UserSubDepartmentMappingModule {}
