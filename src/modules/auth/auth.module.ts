import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { PassportJwtModule } from 'src/adapter/passport-jwt/passport-jwt.module';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { MailerModule } from 'src/microservices/mailer/mailer.module';
import { EmailQueueService } from 'src/microservices/queues/email-queue/email-queue.service';
import { EmailTemplatesService } from '../shared/email-templates.service';
import { CacheManagerService } from 'src/common/cache/cache-manager.service';
import { EmailQueueModule } from 'src/microservices/queues/email-queue/email-queue.module';
import { UserSession } from 'src/entities/user-session.entity';
import { UserSessionModule } from '../user-session/user-session.module';
import { RegionModule } from '../region/region.module';
import { AuthMsTokenService } from './auth-ms-token.service';
import { AuthMsTokenRepository } from './auth-ms-token.repository';
import { AuthMsToken } from 'src/entities/auth-ms-token.entity';
import { MsGraphApiModule } from '../ms-graph-api/ms-graph-api.module';
import { UserSubDepartmentMappingModule } from '../user_subdepartment_mapping/user_subdepartment_mapping.module';
import { RedisCacheService } from 'src/common/redis/redis-cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, AuthMsToken]),
    PassportJwtModule,
    UserModule,
    MailerModule,
    EmailQueueModule,
    UserSessionModule,
    RegionModule,
    MsGraphApiModule,
    UserSubDepartmentMappingModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    EnvironmentConfigService,
    UserService,
    HelperFunctions,
    EmailTemplatesService,
    CacheManagerService,
    RedisCacheService,
    AuthMsTokenService,
    AuthMsTokenRepository,
  ],
  exports: [AuthMsTokenService, AuthMsTokenRepository, AuthService],
})
export class AuthModule {}
