import { IntersectionType } from '@nestjs/swagger';
import { BasicAlarmSearchFilterModel } from './basic-alarm-search-filter.model';
import { PaginationQueryModel } from './pagination.model';

export class ObsAlertSearchFilterModel extends IntersectionType(
  BasicAlarmSearchFilterModel,
  PaginationQueryModel,
) {}
