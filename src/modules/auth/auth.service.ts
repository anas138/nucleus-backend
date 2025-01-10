import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/adapter/passport-jwt/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { LoginModel } from 'src/models/auth.model';
import { UserService } from '../user/user.service';
import { FetchUserModel } from 'src/models/user.model';
import { FetchPermissionModel } from 'src/models/permission.model';
import { FetchUserRolesModel } from 'src/models/user-roles.model';
import { FindOptionsWhere, DataSource, QueryRunner } from 'typeorm';
import { User } from 'src/entities/user.entity';
import {
  APP_CONSTANTS,
  APP_MESSAGES,
  AuthTypes,
  RecordStatus,
  seconds,
  UserType,
} from 'src/common/enums/enums';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { MailerService } from 'src/microservices/mailer/mailer.service';
import { EmailTemplatesService } from '../shared/email-templates.service';
import { UpdatePasswordEmailModel } from 'src/models/email.mode';
import { EmailQueueService } from 'src/microservices/queues/email-queue/email-queue.service';
import { SendMailModel } from 'src/models/send-mail.model';
import { Exception } from 'handlebars';
import { UserSessionModel } from 'src/models/user-session.model';
import { UserSessionService } from '../user-session/user-session.service';
import { UserSession } from 'src/entities/user-session.entity';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthMsTokenService } from './auth-ms-token.service';
import { ClientInfoModel } from 'src/models/client-info.modle';
import { RedisCacheService } from 'src/common/redis/redis-cache.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: EnvironmentConfigService,
    private helperFunctions: HelperFunctions,
    private mailer: MailerService,
    private emailTemplateService: EmailTemplatesService,
    private emailQueueService: EmailQueueService,
    private redisCacheService: RedisCacheService,
    private environmentConfigService: EnvironmentConfigService,
    private readonly userSessionService: UserSessionService,
    @Inject(forwardRef(() => AuthMsTokenService))
    private readonly authMsTokenService: AuthMsTokenService,
    private dataSource: DataSource,
  ) { }

  async login(
    username: string,
    password: string,
    clientInfo: ClientInfoModel,
  ): Promise<LoginModel> {
    const { ip, agent } = clientInfo;
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.startTransaction();

      try {
        const loginResponse = await this.setAuthentication(user);
        await this.createUserSession(loginResponse, ip, agent, queryRunner);
        await queryRunner.commitTransaction();
        return loginResponse;
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
    throw new BadRequestException('Invalid Credentials');
  }

  /**
   * @description
   * @param user
   * @returns
   */
  async setAuthentication(user: FetchUserModel) {
    if (user.user_type === UserType.GROUP) {
      throw new BadRequestException(
        APP_MESSAGES.User.GROUP_USER_LOGIN_NOT_ALLOWED,
      );
    }
    const { accessToken, expiresIn } = await this.setAccessToken(user);

    const { password, ...userWithoutPassword } = user;
    const loginResponse: LoginModel = {
      user: userWithoutPassword,
      tokens: {
        access: {
          token: accessToken,
          expiresIn: expiresIn,
        },
      },
    };

    return loginResponse;
  }

  async setAccessToken(user: FetchUserModel) {
    const payload: IJwtPayload = {
      username: user.username,
      userId: user.id,
      id: user.id,
      email: user.email,
    };
    const expiresIn = this.configService.getJWT_EXPIRATION_TIME() + 's';
    const secret = this.configService.getJWT_SECRET();
    const accessToken = await this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn,
    });

    // set token for this user to use in websocket process
    this.redisCacheService.set(
      APP_CONSTANTS.CACHE_MANAGER.KEYS.WS_USER_TOKEN + user.id,
      accessToken,
      this.configService.getJWT_EXPIRATION_TIME()
    );
    return { accessToken, expiresIn };
  }
  getTransformedUser(user: FetchUserModel) {
    return this.userService.transformUser(user);
  }
  async getAuthUserPermissions(
    user: FetchUserModel,
  ): Promise<FetchPermissionModel[]> {
    const { permissions } = user;
    return permissions.map((permission) => {
      return {
        id: permission.id,
        name: permission.name,
      };
    });
  }

  async getAuthUserRoles(user: FetchUserModel): Promise<FetchUserRolesModel[]> {
    const { roles } = user;
    return roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
      };
    });
  }

  /**
   *
   * @param email  Takes user email against which forgot password journey will run
   */
  async forgotPassword(email: string) {
    const where: FindOptionsWhere<User> = {
      email: email,
    };
    const user = await this.userService.getByCondition(where);
    if (!user) {
      throw new NotFoundException(APP_MESSAGES.User.ERROR_USER_NOT_FOUND);
    }

    const token = this.helperFunctions.generateUUID();
    const { id: userID } = user;
    await this.saveTokenToCache(token, userID);

    const updatePasswordEmailModel: UpdatePasswordEmailModel = {
      name: user.username,
      email: user.email,
      token: token,
    };
    await this.sendPasswordResetEmail(updatePasswordEmailModel);
    return {
      email,
      username: user.username,
      token,
    };
  }

  /**
   *
   * @param updatePasswordEmailModel
   * @returns
   */
  async sendPasswordResetEmail(
    updatePasswordEmailModel: UpdatePasswordEmailModel,
  ) {
    const { email } = updatePasswordEmailModel;
    const html = this.emailTemplateService.getResetPasswordTemplate(
      updatePasswordEmailModel,
    );
    const sendMailModel: SendMailModel = {
      to: email,
      subject: APP_CONSTANTS.EMAIL_SUBJECTS.RESET_PASSWORD,
      html,
    };
    return this.emailQueueService.addJobInQueue({ ...sendMailModel });
  }

  /**
   *
   * @param key : uuid
   * @param value : user id
   *
   */
  async saveTokenToCache(key: string, value: number) {
    const ttl: seconds = APP_CONSTANTS.FORGOT_PASSWORD_TOKEN_TTL;
    await this.redisCacheService.set(key, value, ttl);
  }

  async updatePassword(token: string, password: string) {
    const queryRunner = await this.dataSource.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const userId = await this.redisCacheService.get(token);
      if (!userId || userId == '') {
        throw new NotFoundException(APP_MESSAGES.AUTH.ERROR_UPDATE_PASSWORD);
      }
      await this.userService.updateUser(
        userId,
        {
          password: password,
          last_password_changed: new Date(),
        },
        queryRunner,
      );
      await this.logoutFromPreviousSessions(userId, queryRunner);
      await this.redisCacheService.delete(token);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async createUserSession(
    loginModel: LoginModel,
    ip: string,
    agent: string,
    queryRunner: QueryRunner,
  ) {
    const {
      tokens: {
        access: { token: accessToken },
      },
      user: { id: userId },
    } = loginModel;

    await this.logoutFromPreviousSessions(userId, queryRunner);
    let userSessionModel: UserSessionModel = {
      token: accessToken,
      user_id: userId,
      login_time: new Date(),
      status: AuthTypes.LOGIN,
      ip: ip,
      client: agent,
      logout_time: null,
    };
    const userSession = await this.userSessionService.create(
      userSessionModel,
      queryRunner.manager,
    );

    const { user_id, login_time } = userSession;
    await this.userService.updateUser(
      user_id,
      { last_login: login_time },
      queryRunner,
    );
    return userSession;
  }

  async logoutFromPreviousSessions(userId: number, queryRunner: QueryRunner) {
    const where: FindOptionsWhere<UserSession> = {
      user_id: userId,
      status: AuthTypes.LOGIN,
    };
    const userSession = await this.userSessionService.findByCondition(where);
    if (userSession) {
      let userSessionModel: Partial<UserSessionModel> = {
        logout_time: new Date(),
        status: AuthTypes.LOGOUT,
      };
      await this.userSessionService.updateWithTransactionScope(
        where,
        userSessionModel,
        queryRunner.manager,
      );
      return;
    }
  }

  async logout(accessToken: string, user: FetchUserModel) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await this.userSessionService.updateWithTransactionScope(
        { token: accessToken },
        { logout_time: new Date(), status: AuthTypes.LOGOUT },
        queryRunner.manager,
      );
      // remove user token from websocket user token cache
      await this.redisCacheService.delete(
        APP_CONSTANTS.CACHE_MANAGER.KEYS.WS_USER_TOKEN + user.id,
      );
      await this.authMsTokenService.updateWithCondition(
        { user_id: user.id, record_status: RecordStatus.ACTIVE },
        { record_status: RecordStatus.DELETED },
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  async updatePasswordApi(token: string, password: string) {
    const passBycrypt = await bcrypt.hash(password, 10);
    const verify = this.jwtService.verify(token);
    const { userId } = verify;
    const payload = {
      password: passBycrypt,
    };
    return this.userRepository.updateUser(userId, payload);
  }
}
