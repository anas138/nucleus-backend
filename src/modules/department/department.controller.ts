import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from 'src/dto/department/create-department.dto';
import {
  DepartmentCreatedModel,
  FetchDepartmentModel,
} from 'src/models/department.model';
import { UpdateDepartmentRolesDto } from 'src/dto/department/update-department-roles.dto';
import { DepartmentRoleService } from './department-role.service';
import { UpdateDepartmentDto } from 'src/dto/department/update-department.dto';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES, APP_PERMISSIONS } from 'src/common/enums/enums';
import { AuthGuard } from '@nestjs/passport';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { RolePermissionGuard } from 'src/common/guards/role-permission.guard';
import { PermissionsMetadata } from 'src/common/decorators/permissions.decorator';

@Controller('department')
@UseGuards(AuthGuard(), RolePermissionGuard)
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly departmentRoleService: DepartmentRoleService,
  ) {}

  @Post()
  @PermissionsMetadata(APP_PERMISSIONS.DEPARTMENT.CREATE)
  @ResponseMessageMetadata(APP_MESSAGES.DEPARTMENT.CREATED)
  async createDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentCreatedModel> {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  async findAll(): Promise<FetchDepartmentModel[]> {
    return this.departmentService.findAll();
  }

  @Get('/:departmentId')
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  async findById(
    @Param('departmentId') departmentId: number,
  ): Promise<FetchDepartmentModel> {
    return this.departmentService.findByCondition({ id: departmentId }, null, [
      'sub_departments',
    ]);
  }

  @Put('/:departmentId/role')
  @PermissionsMetadata(APP_PERMISSIONS.ROLE.EDIT)
  async updateDepartmentRole(
    @Param('departmentId') departmentId: number,
    @Body() updateDepartmentRoleDto: UpdateDepartmentRolesDto,
  ): Promise<any> {
    return this.departmentRoleService.updateDepartmentRoles(
      departmentId,
      updateDepartmentRoleDto,
    );
  }
  @Put('/:departmentId')
  @PermissionsMetadata(APP_PERMISSIONS.DEPARTMENT.EDIT)
  async updateDepartment(
    @Param('departmentId') departmentId: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(
      { id: departmentId },
      updateDepartmentDto,
    );
  }

  @Delete('/:departmentId')
  @PermissionsMetadata(APP_PERMISSIONS.DEPARTMENT.DELETE)
  @ResponseMessageMetadata(APP_MESSAGES.DEPARTMENT.DELETED)
  async remove(@Param('departmentId') departmentId: number) {
    return this.departmentService.deleteDepartment(departmentId);
  }

  @Get('/sub/engineering')
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  async getEngineeringSubDepartment() {
    return this.departmentService.engineeringSubDepartment();
  }
}
