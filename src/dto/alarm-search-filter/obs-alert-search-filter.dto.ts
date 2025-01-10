import { PaginationDto } from '../pagination.dto';
import { BasicAlarmSearchFilterDto } from './basic-alarm-search-filter.dto';
import { IntersectionType } from '@nestjs/swagger';

export class ObsALertSearchFilterDto extends IntersectionType(
  BasicAlarmSearchFilterDto,
  PaginationDto,
) {}
