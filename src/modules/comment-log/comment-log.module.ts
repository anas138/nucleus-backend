import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLogRepository } from './comment-log.repository';
import { CommentLogService } from './comment-log.service';
import { CommentLogController } from './comment-log.controller';
import { CommentLog } from 'src/entities/comment-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentLog])],
  providers: [CommentLogRepository, CommentLogService],
  controllers: [CommentLogController],
  exports: [CommentLogRepository, CommentLogService],
})
export class CommentLogModule {}
