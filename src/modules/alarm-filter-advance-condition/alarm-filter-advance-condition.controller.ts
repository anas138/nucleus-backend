import { Controller, Delete, Param } from '@nestjs/common';
import { AlarmFilterAdvanceConditionService } from './alarm-filter-advance-condition.service';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';

@Controller('alarm-filter-advance-conditions')
export class AlarmFilterAdvanceConditionController {
  constructor(private readonly service: AlarmFilterAdvanceConditionService) {}

  @Delete('/:id')
  @ResponseMessageMetadata(APP_MESSAGES.ALARM_ADV_CONDITIONS.DELETED)
  async remove(@Param('id') id: number) {
    return this.service.ifValidRemove(id);
  }
}
