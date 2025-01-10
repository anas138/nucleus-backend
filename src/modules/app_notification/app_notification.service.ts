import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { AppNotification } from 'src/entities/app-notification.entity';
import { AppNotificationRepository } from './app_notification.repository';
import { FindManyOptions } from 'typeorm';
import { FetchUserModel } from 'src/models/user.model';

@Injectable()
export class AppNotificationService extends BaseService<AppNotification> {
  constructor(private readonly appNotificationRepo: AppNotificationRepository) {
    super(appNotificationRepo);
  }

  async createNotifications() {}

  async getNotification(user: FetchUserModel) {
    const where: FindManyOptions<AppNotification> = {
      where: { user_id: user.id },
      order: { id: 'DESC' },
    };
    return this.findAll(where);
    // const query = await this.appNotificationRepo.findNotifications(user);
    // return query;
  }

  async getUnseenNotifications(user: FetchUserModel) {
    return this.appNotificationRepo.getUnseenMessages(user);
  }

  async updateIsSeen(user: FetchUserModel) {
    return this.appNotificationRepo.updateIsSeen(user);
  }
}
