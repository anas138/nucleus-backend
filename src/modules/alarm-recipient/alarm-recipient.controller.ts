import { Controller, Delete, Param } from '@nestjs/common';
import { AlarmRecipientService } from './alarm-recipient.service';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';

@Controller('alarm-recipients')
export class AlarmRecipientController {
  constructor(private readonly service: AlarmRecipientService) {}

  @Delete('/:id')
  @ResponseMessageMetadata(APP_MESSAGES.ALARM_RECIPIENTS.DELETED)
  async remove(@Param('id') id: number) {
    return this.service.ifValidRemove(id);
  }
}
