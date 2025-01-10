import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { CommentLog } from 'src/entities/comment-log.entity';
import { CommentLogRepository } from './comment-log.repository';
import { FindManyOptions } from 'typeorm';
import { ActivityLog } from 'src/common/enums/enums';

@Injectable()
export class CommentLogService extends BaseService<CommentLog> {
  constructor(private commentLogRepository: CommentLogRepository) {
    super(commentLogRepository);
  }
  async getById(id) {
    const where: FindManyOptions<CommentLog> = {
      where: {
        related_id: id,
      },
    };
    return this.findAll(id);
  }
}
