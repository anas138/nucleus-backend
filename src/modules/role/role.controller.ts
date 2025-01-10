import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from 'src/dto/role/create-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionGuard } from 'src/common/guards/role-permission.guard';
import { RolePermissionModel } from 'src/models/role-permission.model';
import {
  FetchRoleModel,
  RoleCreatedModel,
  RoleEditedModel,
} from 'src/models/role.model';
import { PermissionsMetadata } from 'src/common/decorators/permissions.decorator';
import { APP_MESSAGES, APP_PERMISSIONS } from 'src/common/enums/enums';
import { UpdateRolePermissionDto } from 'src/dto/role/update-role-permission.dto';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { FetchPermissionModel } from 'src/models/permission.model';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { UpdateRoleDto } from 'src/dto/role/update-role.dto';

@Controller('roles')
@UseGuards(AuthGuard(), RolePermissionGuard)
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @Get()
  @PermissionsMetadata(APP_PERMISSIONS.ROLE.ACCESS)
  @ResponseMessageMetadata(APP_MESSAGES.Role.FETCHED_ALL)
  async getAll(): Promise<FetchRoleModel[]> {
    return this.roleService.getAll();
  }

  @Post()
  @PermissionsMetadata(APP_PERMISSIONS.ROLE.CREATE)
  @ResponseMessageMetadata(APP_MESSAGES.Role.CREATED)
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<RoleCreatedModel> {
    return this.roleService.createRole(createRoleDto);
  }

  @Get('/:roleId/permissions')
  @PermissionsMetadata(
    APP_PERMISSIONS.ROLE.ACCESS,
    APP_PERMISSIONS.PERMISSION.ACCESS,
  )
  @ResponseMessageMetadata(APP_MESSAGES.RolePermission.FETCHED_ALL)
  async getRolePermissions(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<FetchPermissionModel[]> {
    return this.rolePermissionService.getRolePermissions(roleId);
  }

  @Put('/:roleId/permissions')
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  @ResponseMessageMetadata(APP_MESSAGES.RolePermission.UPDATED)
  async updateRolePermissions(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() updateRolePermissionsDto: UpdateRolePermissionDto,
  ): Promise<RolePermissionModel> {
    return this.rolePermissionService.updateRolePermissions(
      roleId,
      updateRolePermissionsDto,
    );
  }

  @Put('/:roleId')
  @PermissionsMetadata(APP_PERMISSIONS.ROLE.EDIT)
  @ResponseMessageMetadata(APP_MESSAGES.Role.UPDATED)
  async updateRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEditedModel> {
    return this.roleService.updateRole(roleId, updateRoleDto);
  }
  @Get('/:roleId')
  @PermissionsMetadata(APP_PERMISSIONS.ROLE.ACCESS)
  async getRole(
    @Param('roleId', ParseIntPipe) roleId,
  ): Promise<FetchRoleModel> {
    return this.roleService.getRoleById(roleId);
  }

  @Get('/:roleId/remaining-permissions')
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  async getRoleRemainingPermissions(@Param('roleId', ParseIntPipe) roleId) {
    return this.rolePermissionService.getRoleRemainingPermissions(roleId);
  }

  @Delete(':roleId')
  @PermissionsMetadata(APP_PERMISSIONS.ROLE.DELETE)
  @ResponseMessageMetadata(APP_MESSAGES.Role.DELETED)
  async deleteRole(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.deleteRole(roleId);
  }
}
