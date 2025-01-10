import { Controller } from '@nestjs/common';
import { USerSubDepartmentMappingService } from './user_subdepartment_mapping.service';

@Controller()
export class UserSubDepartmentMappingController {
  constructor(
    private readonly userSubDeptMappingService: USerSubDepartmentMappingService,
  ) {}
}
