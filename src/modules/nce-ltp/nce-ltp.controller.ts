import { Controller, Get, Query } from '@nestjs/common';
import { NceLtpService } from './nce-ltp.service';
import { PaginationDto } from 'src/dto/pagination.dto';

@Controller()
export class NceLtpController {
  constructor(private nceLtpService: NceLtpService) {}
  @Get()
  async getAllNceLtp(@Query() paginationDto: PaginationDto): Promise<any> {
    return this.nceLtpService.findAllPaginated(paginationDto);
  }
}
