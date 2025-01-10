import { Injectable, Req } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { UserSession } from 'src/entities/user-session.entity';
import { UserSessionRepository } from './user-session.repository';

@Injectable()
export class UserSessionService extends BaseService<UserSession> {
  constructor(private readonly repo: UserSessionRepository) {
    super(repo);
  }
}
