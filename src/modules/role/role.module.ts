import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PassportJwtModule } from 'src/adapter/passport-jwt/passport-jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { RoleRepository } from 'src/repositories/role.repository';
import { RolePermissionService } from './role-permission.service';
import { Permission } from 'src/entities/permission.entity';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]),
    PassportJwtModule,
    PermissionModule,
  ],
  providers: [
    RoleService,
    RoleRepository,
    RolePermissionService,
  ],
  controllers: [RoleController],
  exports: [RoleService, RolePermissionService],
})
export class RoleModule {}
