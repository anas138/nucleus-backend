import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppDashboardWidgetService } from './app-dashboard-widget.service';
import { AppDashboardWidget } from 'src/entities/app-dashboard-widgets.entity';
import { FindOptionsWhere } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { UpdateAppDashboardWidgetDto } from 'src/dto/app-dashboard-widget/update-app-dashboard-widget.dto';

@Controller('app-dashboard-widget')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class AppDashboardWidgetController {
  constructor(
    private readonly appDashboardWidgetService: AppDashboardWidgetService,
  ) {}

  @Delete('/:id')
  @ResponseMessageMetadata(APP_MESSAGES.APP_DASHBOARD_WIDGET.DELETED)
  async deleteWidget(@Param('id') id: number) {
    const payload = { id: id };
    return this.appDashboardWidgetService.deleteRecord(payload);
  }

  @Put('/:id')
  @ResponseMessageMetadata(APP_MESSAGES.APP_DASHBOARD_WIDGET.UPDATE_WIDGET)
  async updateWidgets(
    @Param('id') id: number,
    @Body() body: UpdateAppDashboardWidgetDto,
  ) {
    const where: FindOptionsWhere<AppDashboardWidget> = {
      id: id,
    };
    return this.appDashboardWidgetService.update(where, body);
  }
}
