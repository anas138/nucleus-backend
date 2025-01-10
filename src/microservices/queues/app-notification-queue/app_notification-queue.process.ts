import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { APP_CONSTANTS, QUEUES } from 'src/common/enums/enums';
import { AppNotificationService } from 'src/modules/app_notification/app_notification.service';
import { UserService } from 'src/modules/user/user.service';
import { SocketGatewayService } from 'src/microservices/gateways/services/socket.gateway.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { NotificationModel } from 'src/models/notification.model';
const configService = new EnvironmentConfigService(new ConfigService());

@Processor(QUEUES.APP_NOTIFICATION_QUEUE)
export class AppNotificationQueueProcess {
  constructor(
    private readonly appNotificationService: AppNotificationService,
    private readonly userService: UserService,
    private readonly socketGatewayService: SocketGatewayService,
  ) {}

  @Process()
  async sendNotification(job: Job<NotificationModel>) {
    await job.progress(20);
    const { data } = job;
    const notificationPayload = data.payload;

    const notification = await this.appNotificationService.create(
      notificationPayload,
    );
    const userSocket = APP_CONSTANTS.WEBSOCKET_ROOMS.USER_IDS_ROOM(
      notificationPayload.user_id,
    );
    const socketObj = {
      room: userSocket,
      event: 'trouble_ticket_notification',
      data: notificationPayload,
    };
    this.socketGatewayService.emitToRoom(
      socketObj.room,
      socketObj.event,
      socketObj.data,
    );
    await job.progress(100);
  }
}
