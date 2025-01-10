import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';
import { CommentLog } from 'src/entities/comment-log.entity';

@Injectable()
export class CommentLogRepository extends BaseAbstractRepository<CommentLog> {
  constructor(
    @InjectRepository(CommentLog)
    private readonly commentLogRepository: Repository<CommentLog>,
  ) {
    super(commentLogRepository);
  }
}
