import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  ParseIntPipe,
  ParseEnumPipe,
  Query,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserPermissionService } from './user-permission.service';
import { UserRoleService } from './user-role.service';
import {
  FetchUserModel,
  SimpleFetchUser,
  UserCreatedModel,
} from 'src/models/user.model';
import {
  FetchUserPermissionsModel,
  UserPermissionsModel,
} from 'src/models/user-permissions.model';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import {
  FetchUserRolesModel,
  UserRolesModel,
} from 'src/models/user-roles.model';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import {
  APP_MESSAGES,
  APP_PERMISSIONS,
  RecordStatus,
  UserType,
} from 'src/common/enums/enums';
import { UpdateUserRolesDto } from 'src/dto/user/update-user-roles.dto';
import { UpdateUserPermissionsDto } from 'src/dto/user/update-user-permission.dto copy';
import { PaginationDto } from 'src/dto/pagination.dto';
import { PaginatedResultsModel } from 'src/models/pagination.model';
import { User } from 'src/entities/user.entity';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { RolePermissionGuard } from 'src/common/guards/role-permission.guard';
import { PermissionsMetadata } from 'src/common/decorators/permissions.decorator';

@Controller('users')
@UseGuards(AuthGuard(), RolePermissionGuard)
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userPermissionService: UserPermissionService,
    private readonly userRoleService: UserRoleService,
  ) {}

  @Post()
  @PermissionsMetadata(APP_PERMISSIONS.USER.CREATE)
  @ResponseMessageMetadata(APP_MESSAGES.User.USER_CREATED)
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return await this.userService.sendSetupPasswordMail(user);
  }

  @Get()
  @PermissionsMetadata(APP_PERMISSIONS.USER.ACCESS)
  @ResponseMessageMetadata(APP_MESSAGES.User.FETCHED_ALL)
  async getAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResultsModel> {
    return this.userService.getAll(paginationDto);
  }

  @Get('/:userId')
  @PermissionsMetadata(APP_PERMISSIONS.USER.ACCESS)
  @ResponseMessageMetadata(APP_MESSAGES.User.FETCHED)
  async getUserById(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<FetchUserModel> {
    return this.userService.getUserById(userId);
  }

  @Get('/:userId/permissions')
  @PermissionsMetadata(APP_PERMISSIONS.PERMISSION.ACCESS)
  @ResponseMessageMetadata(APP_MESSAGES.UserPermission.FETCHED_ALL)
  async getUserPermissions(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<FetchUserPermissionsModel[]> {
    return this.userPermissionService.getUserPermissions(userId);
  }

  @Get('/:userId/remaining-permissions')
  @PermissionsMetadata(APP_PERMISSIONS.PERMISSION.ACCESS)
  @ResponseMessageMetadata(
    APP_MESSAGES.UserPermission.FETCHED_REMAINING_PERMISSIONS,
  )
  async getRemainingUserPermissions(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<FetchUserPermissionsModel[]> {
    return this.userPermissionService.getRemainingUserPermissions(userId);
  }

  @Put('/:userId/permissions')
  @PermissionsMetadata(APP_PERMISSIONS.PERMISSION.EDIT)
  @ResponseMessageMetadata(APP_MESSAGES.UserPermission.UPDATED)
  async updateUserPermissions(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserPermissionsDto: UpdateUserPermissionsDto,
  ): Promise<UserPermissionsModel> {
    return this.userPermissionService.updateUserPermissions(
      userId,
      updateUserPermissionsDto,
    );
  }

  @Put('/:userId/roles')
  @PermissionsMetadata(APP_PERMISSIONS.ROLE.EDIT)
  @ResponseMessageMetadata(APP_MESSAGES.UserRole.UPDATED)
  async updateUserRoles(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserRolesDto: UpdateUserRolesDto,
  ): Promise<UserRolesModel> {
    return this.userRoleService.updateUserRoles(userId, updateUserRolesDto);
  }

  @Get('/:userId/roles')
  @PermissionsMetadata(APP_PERMISSIONS.ROLE.ACCESS)
  @ResponseMessageMetadata(APP_MESSAGES.UserRole.FETCHED_ALL)
  async getRemainingUserRoles(
    @Param('userId', ParseIntPipe) userId,
  ): Promise<FetchUserRolesModel[]> {
    return this.userRoleService.getUserRoles(userId);
  }

  @Get('/:userId/remaining-roles')
  @PermissionsMetadata(APP_PERMISSIONS.ROLE.ACCESS)
  @ResponseMessageMetadata(APP_MESSAGES.UserRole.FETCHED_ALL)
  async getUserRoles(
    @Param('userId', ParseIntPipe) userId,
  ): Promise<FetchUserRolesModel[]> {
    return this.userRoleService.getRemainingUserRoles(userId);
  }

  @Put('/:userId')
  @PermissionsMetadata(APP_PERMISSIONS.USER.EDIT)
  @ResponseMessageMetadata(APP_MESSAGES.User.USER_UPDATED)
  updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() user: UpdateUserDto,
  ): Promise<FetchUserModel | any> {
    return this.userService.updateUser(userId, user);
  }

  @Delete('/:userId')
  @PermissionsMetadata(APP_PERMISSIONS.USER.DELETE)
  @ResponseMessageMetadata(APP_MESSAGES.User.USER_STATUS_UPDATED)
  async updateUserRecordStatus(
    @Param('userId') userId: number,
    @Query('record_status', new ParseEnumPipe(RecordStatus))
    record_status: RecordStatus,
  ) {
    return this.userService.updateUserRecordStatus(userId, record_status);
  }

  @Get('/user-type/:userType')
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  async getAllUsersByUserType(
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ): Promise<SimpleFetchUser[]> {
    return this.userService.getAllUsersByUserType(userType);
  }

  @Get('sub-department-id/:id')
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  async getGroupUserBySubDepartment(@Param('id') id: number) {
    return this.userService.getGroupUserBySubDepartment(id);
  }
}
