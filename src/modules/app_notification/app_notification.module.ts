import { Module } from '@nestjs/common';
import { AppNotificationController } from './app_notification.controller';
import { AppNotificationService } from './app_notification.service';
import { AppNotificationRepository } from './app_notification.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppNotification } from 'src/entities/app-notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppNotification])],
  controllers: [AppNotificationController],
  providers: [AppNotificationService, AppNotificationRepository],
  exports: [AppNotificationService, AppNotificationRepository],
})
export class AppNotificationModule {}
