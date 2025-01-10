import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { PassportJwtModule } from 'src/adapter/passport-jwt/passport-jwt.module';
import { UserRepository } from 'src/repositories/user.repository';
import { UserPermissionService } from './user-permission.service';
import { UserRoleService } from './user-role.service';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../role/role.module';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { EmailQueueModule } from 'src/microservices/queues/email-queue/email-queue.module';
import { EmailTemplatesService } from '../shared/email-templates.service';
import { CacheManagerService } from 'src/common/cache/cache-manager.service';
import { RegionModule } from '../region/region.module';
import { RegionService } from '../region/region.service';
import { EnvironmentConfigModule } from 'src/config/environment-config/environment-config.module';
import { UserSubDepartmentMappingModule } from '../user_subdepartment_mapping/user_subdepartment_mapping.module';
import { RedisCacheService } from 'src/common/redis/redis-cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    PassportJwtModule,
    PermissionModule,
    RoleModule,
    EmailQueueModule,
    RegionModule,
    EnvironmentConfigModule,
    UserSubDepartmentMappingModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserPermissionService,
    UserRoleService,
    HelperFunctions,
    EmailTemplatesService,
    RedisCacheService,
  ],
  exports: [
    UserRepository,
    UserService,
    UserPermissionService,
    UserRoleService,
    HelperFunctions,
  ],
})
export class UserModule {}
