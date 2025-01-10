import { PaginationDto } from '../pagination.dto';
import { BasicAlarmSearchFilterDto } from './basic-alarm-search-filter.dto';
import { IntersectionType } from '@nestjs/swagger';

export class NceALarmSearchFilterDto extends IntersectionType(
  BasicAlarmSearchFilterDto,
  PaginationDto,
) {}
