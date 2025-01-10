import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryModel } from './pagination.model';
import { BasicAlarmSearchFilterModel } from './basic-alarm-search-filter.model';

export class NceAlarmSearchFilterModel extends IntersectionType(
  BasicAlarmSearchFilterModel,
  PaginationQueryModel,
) {}
