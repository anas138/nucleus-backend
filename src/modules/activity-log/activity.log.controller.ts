import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';

@Controller('activity-log')
export class ActivityLogController {
  constructor(private activityLogService: ActivityLogService) {}

  @Post()
  async createActivityLog(@Body() body: any) {
    return this.activityLogService.create(body);
  }

  @Get('/:id')
  async getActivityLogById(@Param('id') id: number) {
    return this.activityLogService.getById(id);
  }
}
