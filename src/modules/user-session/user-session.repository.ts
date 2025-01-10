import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSession } from 'src/entities/user-session.entity';
import { User } from 'src/entities/user.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class UserSessionRepository extends BaseAbstractRepository<UserSession> {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSession: Repository<UserSession>,
  ) {
    super(userSession);
  }
}
