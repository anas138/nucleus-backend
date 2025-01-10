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
import { SubDepartmentService } from './sub-department.service';
import { CreateSubDepartmentDto } from 'src/dto/sub-department/create-sub-department.dto';
import {
  FetchSubDepartmentModel,
  SubDepartmentCreatedModel,
} from 'src/models/sub-department.model';
import { UpdateSubDepartmentDto } from 'src/dto/sub-department/update-sub-department.dto';
import {
  APP_CONSTANTS,
  APP_MESSAGES,
  APP_PERMISSIONS,
  UserType,
} from 'src/common/enums/enums';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { AuthGuard } from '@nestjs/passport';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { FindOptionsWhere, Not } from 'typeorm';
import { SubDepartment } from 'src/entities/sub-department.entity';

@Controller('subDepartment')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class SubDepartmentController {
  constructor(private readonly subDepartmentService: SubDepartmentService) {}

  @Post()
  async createSubDepartment(
    @Body() createSubDepartmentDto: CreateSubDepartmentDto,
  ): Promise<SubDepartmentCreatedModel> {
    return this.subDepartmentService.create(createSubDepartmentDto);
  }
  @Get()
  async findAll(): Promise<FetchSubDepartmentModel[]> {
    return this.subDepartmentService.findAll();
  }
  @Get('/:subDepartmentId')
  async findById(
    @Param('subDepartmentId') subDepartmentId: number,
  ): Promise<FetchSubDepartmentModel> {
    return this.subDepartmentService.findById({ id: subDepartmentId });
  }
  @Put('/:subDepartmentId')
  async updateSubDepartment(
    @Param('subDepartmentId') subDepartmentId: number,
    @Body() updateDepartmentDto: UpdateSubDepartmentDto,
  ) {
    return this.subDepartmentService.update(
      { id: subDepartmentId },
      updateDepartmentDto,
    );
  }
  @Delete('/:subDepartmentId')
  @ResponseMessageMetadata(APP_MESSAGES.SUB_DEPARTMENT.DELETED)
  async remove(@Param('subDepartmentId') subDepartmentId: number) {
    return this.subDepartmentService.deleteSubDepartment(subDepartmentId);
  }

  @Get('/:id/users')
  async getUsersBySubDepartment(@Param('id') id: number) {
    const where: FindOptionsWhere<SubDepartment> = {
      id: id,
      users:{ user_type: UserType.EMPLOYEE },
    };
    const relations = ['users'];
    return this.subDepartmentService.findByCondition(where, null, relations);
  }
}
