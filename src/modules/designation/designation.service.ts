import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Designation } from 'src/entities/designation.entity';
import { FetchDesignationModel } from 'src/models/designation.model';
import { DesignationRepository } from 'src/repositories/designation.repository';
import { UserService } from '../user/user.service';
import { APP_MESSAGES } from 'src/common/enums/enums';

@Injectable()
export class DesignationService extends BaseService<Designation> {
  constructor(
    private readonly designationRepository: DesignationRepository,
    private readonly userService: UserService,
  ) {
    super(designationRepository);
  }

  async deleteDesignation(designationId: number) {
    const designation: Designation =
      await this.designationRepository.findByCondition(
        { id: designationId },
        null,
        ['users'],
      );
    if (!designation) {
      throw new NotFoundException(
        APP_MESSAGES.DESIGNATION.ERROR_DESIGNATION_NOT_FOUND,
      );
    }

    if (designation.users && designation.users.length) {
      throw new ConflictException(
        APP_MESSAGES.DESIGNATION.ERROR_DELETE_USER_EXIST,
      );
    }
    return this.designationRepository.deleteDesignation(designation);
  }
}
