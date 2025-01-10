import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { AuthMsToken } from 'src/entities/auth-ms-token.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AuthMsTokenRepository extends BaseAbstractRepository<AuthMsToken> {
  constructor(
    @InjectRepository(AuthMsToken)
    private readonly repo: Repository<AuthMsToken>,
  ) {
    super(repo);
  }
}
