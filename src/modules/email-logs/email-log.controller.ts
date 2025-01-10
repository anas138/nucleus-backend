import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmailLogsService } from './email-logs.service';
import { AuthGuard } from '@nestjs/passport';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { PaginationQueryModel } from 'src/models/pagination.model';

@Controller('email-logs')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class EmailLogsController {
  constructor(private readonly emailLogsService: EmailLogsService) {}
  @Get()
  async getEmailLogs(@Query() paginatedQuery: PaginationQueryModel) {
    return this.emailLogsService.findAllPaginated(paginatedQuery);
  }
}
