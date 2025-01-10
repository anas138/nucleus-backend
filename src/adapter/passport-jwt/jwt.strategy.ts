import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from './jwt-payload.interface';
import { UserRepository } from 'src/repositories/user.repository';
import { FetchUserModel } from 'src/models/user.model';
import { Permission } from 'src/entities/permission.entity';
import { UserSessionService } from 'src/modules/user-session/user-session.service';
import { FindOptionsWhere } from 'typeorm';
import { UserSessionModel } from 'src/models/user-session.model';
import { APP_MESSAGES, AuthTypes } from 'src/common/enums/enums';
import { Request } from 'express';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';
import { UserSession } from 'src/entities/user-session.entity';
const configSerivce = new EnvironmentConfigService(new ConfigService());

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository,
    private userSessionService: UserSessionService,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload): Promise<FetchUserModel> {
    const { username } = payload;
    const user: FetchUserModel = await this.userRepository.findByUsername(
      username,
    );
    if (!user) {
      throw new UnauthorizedException(
        APP_MESSAGES.User.ERROR_USER_UNAUTHORIZED,
      );
    }
    const token = req.headers.authorization?.split(' ')[1];
    const where: FindOptionsWhere<UserSessionModel> = {
      user_id: user.id,
      status: AuthTypes.LOGIN,
      token,
    };
    const checkToken = await this.userSessionService.findByCondition(where);
    let checkTime: any;
    if (!checkToken) {
      throw new UnauthorizedException(
        APP_MESSAGES.User.ERROR_USER_UNAUTHORIZED,
      );
    }
    const { last_activity_time } = checkToken;
    checkTime =
      new Date().getMinutes() - new Date(last_activity_time).getMinutes();
    const whereUserSession: FindOptionsWhere<UserSession> = {
      id: checkToken.id,
    };

    if (checkTime >= configSerivce.getSessionIdleTimeout()) {
      const userSession = {
        status: AuthTypes.LOGOUT,
        logout_time: new Date(),
      };

      await this.userSessionService.update(whereUserSession, userSession);
      throw new UnauthorizedException(
        APP_MESSAGES.User.ERROR_USER_UNAUTHORIZED,
      );
    } else {
      const userSession = {
        last_activity_time: new Date(),
      };
      await this.userSessionService.update(whereUserSession, userSession);
    }
    const permissions: Permission[] = this.getUserExistingPermissions(user);
    user.permissions = [...permissions];
    return user;
  }

  getUserExistingPermissions(user: FetchUserModel): Permission[] {
    const userPermissionsSet: any = new Set();
    for (const role of user.roles) {
      for (const permission of role.permissions) {
        userPermissionsSet.add(permission);
      }
    }
    for (const permission of user.permissions) {
      userPermissionsSet.add(permission);
    }

    return Array.from(userPermissionsSet);
  }
}
