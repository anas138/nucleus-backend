import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  ParseIntPipe,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from 'src/dto/permission/create-permission.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  FetchPermissionModel,
  PermissionCreatedModel,
} from 'src/models/permission.model';
import { RolePermissionGuard } from 'src/common/guards/role-permission.guard';
import { PermissionsMetadata } from 'src/common/decorators/permissions.decorator';
import { APP_MESSAGES, APP_PERMISSIONS } from 'src/common/enums/enums';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';

@Controller('permissions')
@UseGuards(AuthGuard(), RolePermissionGuard)
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @PermissionsMetadata(APP_PERMISSIONS.PERMISSION.ACCESS)
  async getAll(): Promise<FetchPermissionModel[]> {
    return this.permissionService.getAll();
  }

  @Post()
  @PermissionsMetadata(APP_PERMISSIONS.PERMISSION.CREATE)
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionCreatedModel> {
    return this.permissionService.createPermission(createPermissionDto);
  }

  @Get('/:permissionId')
  @PermissionsMetadata(APP_PERMISSIONS.PERMISSION.ACCESS)
  async getPermission(
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Promise<FetchPermissionModel> {
    return this.permissionService.getPermissionById(permissionId);
  }

  @Delete(':permissionId')
  @ResponseMessageMetadata(APP_MESSAGES.Permission.DELETED)
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  async deleteRole(@Param('permissionId', ParseIntPipe) permissionId: number) {
    return this.permissionService.deletePermission(permissionId);
  }
}
