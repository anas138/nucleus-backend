import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppDashboardService } from './app-dashboard.service';
import { FindOptionsWhere } from 'typeorm';
import { AppDashboard } from 'src/entities/app-dashboard.entity';
import { CreateAppDashboardDto } from 'src/dto/app-dashboard/create-app-dashboard.dto';
import { CreateAppDashboardModel } from 'src/models/app-dashboard.model';
import { AppDashboardWidgetService } from '../app-dashboard-widget/app-dashboard-widget.service';
import { AppDashboardWidgetModel } from 'src/models/app-dashboard-widget.model';
import { AuthGuard } from '@nestjs/passport';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { CreateAppDashboardWidgetDto } from 'src/dto/app-dashboard-widget/create-app-dashboaed-widget.dto';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { UpdateAppDashboardDto } from 'src/dto/app-dashboard/update-app-dashboard.dto';

@Controller('app-dashboard')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class AppDashboardController {
  constructor(
    private readonly appDashboardService: AppDashboardService,
    private readonly appDashboardWidgetService: AppDashboardWidgetService,
  ) {}

  @Post()
  @ResponseMessageMetadata(APP_MESSAGES.APP_DASHBOARD.CREATED)
  async createDashboard(
    @Body() body: CreateAppDashboardDto,
  ): Promise<CreateAppDashboardModel> {
    return this.appDashboardService.createDashboard(body);
  }

  @Get()
  @ResponseMessageMetadata(APP_MESSAGES.APP_DASHBOARD.FETCHED_ALL)
  async getDashboard(@Request() req) {
    return this.appDashboardService.findAll({
      where: { created_by: req.user.id },
      order: { is_default: 'desc' },
    });
  }

  @Get('/:id')
  @ResponseMessageMetadata(
    APP_MESSAGES.APP_DASHBOARD.FETCHED_WIDGET_BY_DASHBOARD,
  )
  async getWidgetsByDashboard(@Param('id') id: number) {
    const dash = await this.appDashboardService.getDashboard(id);
    return dash;
  }

  @Delete('/:id')
  @ResponseMessageMetadata(APP_MESSAGES.APP_DASHBOARD.DELETED)
  async deleteDashboard(@Param('id') id: number) {
    const payload = { id: id };
    return this.appDashboardService.deleteRecord(payload);
  }

  //PATCH: baseUrl/dashboard/:id

  @Patch('/:id')
  @ResponseMessageMetadata(APP_MESSAGES.APP_DASHBOARD.UPDATE_DASHBOARD)
  async updateDashboard(
    @Param('id') id: number,
    @Body() body: UpdateAppDashboardDto,
  ) {
    const where: FindOptionsWhere<AppDashboard> = {
      id: id,
    };
    if (body.is_default) await this.appDashboardService.defaultDashboard(id);
    return this.appDashboardService.update(where, body);
  }

  @Post('/:id/widget')
  @ResponseMessageMetadata(APP_MESSAGES.APP_DASHBOARD_WIDGET.CREATED)
  async createWidget(
    @Param('id') id: number,
    @Body() body: CreateAppDashboardWidgetDto,
  ) {
    return this.appDashboardService.createWidget(id, body);
  }

  @Get('/:id/widget')
  @ResponseMessageMetadata(APP_MESSAGES.APP_DASHBOARD_WIDGET.FETCHED_WIDGET)
  async getWidgets(
    @Param('id') id: number,
  ): Promise<AppDashboardWidgetModel[]> {
    const payload = {
      where: { app_dashboard_id: id },
    };
    return this.appDashboardWidgetService.findAll(payload);
  }
}
