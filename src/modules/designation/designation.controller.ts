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
import { DesignationService } from './designation.service';
import { APP_MESSAGES, APP_PERMISSIONS } from 'src/common/enums/enums';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { CreateDesignationDto } from 'src/dto/designation/create-designation.dto';
import {
  DesignationCreatedModel,
  FetchDesignationModel,
} from 'src/models/designation.model';
import { UpdateDesignationtDto } from 'src/dto/designation/update-designation.dto';
import { AuthGuard } from '@nestjs/passport';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { RolePermissionGuard } from 'src/common/guards/role-permission.guard';
import { PermissionsMetadata } from 'src/common/decorators/permissions.decorator';

@Controller('designation')
@UseGuards(AuthGuard(), RolePermissionGuard)
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  @Post()
  @PermissionsMetadata(APP_PERMISSIONS.DESIGNATION.CREATE)
  @UseInterceptors(new OnCreateInterceptor())
  async createDesignation(
    @Body() createDesignationDto: CreateDesignationDto,
  ): Promise<DesignationCreatedModel> {
    return this.designationService.create(createDesignationDto);
  }

  @Get()
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  async findAll(): Promise<FetchDesignationModel[]> {
    return this.designationService.findAll();
  }

  @Get('/:designationId')
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  async findById(
    @Param('designationId') designationId: number,
  ): Promise<FetchDesignationModel> {
    return this.designationService.findById({ id: designationId });
  }

  @Put('/:designationId')
  @PermissionsMetadata(APP_PERMISSIONS.DESIGNATION.EDIT)
  @UseInterceptors(new OnUpdateInterceptor())
  async updateDesignation(
    @Param('designationId') designationId: number,
    @Body() updateDesignationDto: UpdateDesignationtDto,
  ) {
    return this.designationService.update(
      { id: designationId },
      updateDesignationDto,
    );
  }

  @Delete('/:designationId')
  @PermissionsMetadata(APP_PERMISSIONS.DESIGNATION.DELETE)
  @ResponseMessageMetadata(APP_MESSAGES.DESIGNATION.DELETED)
  async remove(@Param('designationId') designationId: number) {
    return this.designationService.deleteDesignation(designationId);
  }
}
