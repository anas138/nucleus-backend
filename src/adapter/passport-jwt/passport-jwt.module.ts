import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { EnvironmentConfigModule } from 'src/config/environment-config/environment-config.module';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { UserSessionModule } from 'src/modules/user-session/user-session.module';
import { JwtWsStrategy } from './jwt-websocket.strategy';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    UserSessionModule,
    JwtModule.registerAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (configService: EnvironmentConfigService) => ({
        secret: configService.getJWT_SECRET(),
        expiresIn: configService.getJWT_EXPIRATION_TIME() + 's',
      }),
    }),
    // Other module imports...
  ],
  providers: [JwtStrategy, UserRepository, HelperFunctions, JwtWsStrategy],
  exports: [PassportModule, JwtModule, JwtStrategy, JwtWsStrategy],
})
export class PassportJwtModule {}
