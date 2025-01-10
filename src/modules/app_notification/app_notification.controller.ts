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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { AppNotificationService } from './app_notification.service';
import { FindOptionsWhere } from 'typeorm';
import { AppNotification } from 'src/entities/app-notification.entity';
import { AuthGuard } from '@nestjs/passport';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { IUserRequestInterface } from 'src/interfaces/user.request.interface';

@Controller('app-notification')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class AppNotificationController {
  constructor(
    private readonly appNotificationService: AppNotificationService,
  ) {}

  @Post()
  async createAppNotification(@Body() body: any) {
    return this.appNotificationService.create(body);
  }

  @Get()
  async getAppNotification(@Req() req: IUserRequestInterface) {
    const { user } = req;
    return this.appNotificationService.getNotification(user);
  }

  @Patch('/:id/is-open')
  async updateAppNotification(@Param('id') id: number, @Body() body: any) {
    const whereId: FindOptionsWhere<AppNotification> = {
      id: id,
    };
    return this.appNotificationService.update(whereId, body);
  }

  @Get('/unseen')
  getUnseenNotifications(@Req() req: IUserRequestInterface) {
    const { user } = req;
    return this.appNotificationService.getUnseenNotifications(user);
  }
  @Put('/is_seen')
  async updateSeen(@Req() req: IUserRequestInterface) {
    const { user } = req;
    return this.appNotificationService.updateIsSeen(user);
  }

  @Delete('/:id')
  async deleteNotification(@Param('id') id: number) {
    return this.appNotificationService.deleteRecord({ id: id });
  }

  @Delete('/user/:id')
  async deleteNotificationByUser(@Param('id') id: number) {
    return this.appNotificationService.deleteRecord({ user_id: id });
  }
}
