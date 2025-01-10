import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionService } from './user-session.service';
import { UserSessionRepository } from './user-session.repository';
import { UserSession } from 'src/entities/user-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession])],
  controllers: [],
  providers: [UserSessionService, UserSessionRepository],
  exports: [UserSessionService],
})
export class UserSessionModule {}
