import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { NceSubnetService } from './nce-subnet.service';

@Controller()
export class NceLtpController {
  constructor(private nceSubnetService: NceSubnetService) { }
}
