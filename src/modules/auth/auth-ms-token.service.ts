import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { AuthMsToken } from 'src/entities/auth-ms-token.entity';
import { AuthMsTokenRepository } from './auth-ms-token.repository';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RecordStatus } from 'src/common/enums/enums';
import { MsGraphApiService } from '../ms-graph-api/ms-graph-api.service';
import { DataSource, QueryRunner } from 'typeorm';
import { ClientInfoModel } from 'src/models/client-info.modle';

@Injectable()
export class AuthMsTokenService extends BaseService<AuthMsToken> {
  constructor(
    private readonly authMsTokenRepository: AuthMsTokenRepository,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly msGraphApiService: MsGraphApiService,
    private dataSource: DataSource,
  ) {
    super(authMsTokenRepository);
  }

  async login(body: any, clientInfo: ClientInfoModel) {
    const { msalLoginResponse, email } = body;
    const { ip, agent } = clientInfo;
    const userInfo = await this.userService.getByCondition({
      ms_org_email: email,
    });

    if (!userInfo) {
      throw new BadRequestException('Account does not Exists. Please Sign up.');
    }

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await this.userService.findByUsername(userInfo.username);
      const loginResponse = await this.authService.setAuthentication(user);
      await this.authService.createUserSession(
        loginResponse,
        ip,
        agent,
        queryRunner,
      );
      if (loginResponse) {
        await this.updateWithCondition(
          { user_id: userInfo.id, record_status: RecordStatus.ACTIVE },
          { record_status: RecordStatus.DELETED },
          queryRunner.manager,
        );
        const payload = {
          user_id: userInfo.id,
          ms_org_email: email,
          access_token: msalLoginResponse.accessToken,
          scopes: msalLoginResponse.scopes.toString(),
          expires_on: msalLoginResponse.expiresOn,
          created_by: userInfo.id,
        };

        await this.create(payload, queryRunner.manager);

        // Set Access Token
        this.msGraphApiService.setAccessToken(msalLoginResponse.accessToken);
        const profilePicture = await this.msGraphApiService.getProfilePicture();

        loginResponse.user.profile_picture =
          profilePicture || userInfo.profile_picture;
        await queryRunner.commitTransaction();
        return loginResponse;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
