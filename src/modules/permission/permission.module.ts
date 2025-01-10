import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { PassportJwtModule } from 'src/adapter/passport-jwt/passport-jwt.module';
import { PermissionRepository } from 'src/repositories/permission.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    PassportJwtModule,
  ],
  providers: [PermissionService, PermissionRepository],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
