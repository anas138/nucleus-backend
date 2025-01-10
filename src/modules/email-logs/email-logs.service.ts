import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { EmailLogs } from 'src/entities/email-logs.entity';
import { EmailLogsRepository } from './email-logs.repository';
import {
  PaginationCalculatedModel,
  PaginationQueryModel,
} from 'src/models/pagination.model';
import { HelperFunctions } from 'src/common/util/helper-functions';

@Injectable()
export class EmailLogsService extends BaseService<EmailLogs> {
  constructor(
    private readonly emailLogsRepository: EmailLogsRepository,
    private readonly helperFunctions: HelperFunctions,
  ) {
    super(emailLogsRepository);
  }
  async findAllPaginated(paginatedData: PaginationQueryModel) {
    const calculatedPagination: PaginationCalculatedModel =
      this.helperFunctions.calculatePagination(paginatedData);
    return this.emailLogsRepository.findAllPaginated(calculatedPagination);
  }
}
