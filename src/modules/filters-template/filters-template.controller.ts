import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { FiltersTemplateService } from './filters-template.service';
import { FiltersTemplate } from 'src/entities/filters-template';
import { FiltersTemplateGetAllQueryParams } from 'src/dto/filters-template/get-all-query-parms.dto';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { FiltersTemplateDto } from 'src/dto/filters-template/filters-template.dto';

@Controller('filters-template')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class FiltersTemplateController {
  constructor(
    private readonly filtersTemplateService: FiltersTemplateService,
  ) {}

  @Get()
  @ResponseMessageMetadata(APP_MESSAGES.FILTERS_TEMPLATES.FETCHED_ALL)
  async findAll(
    @Request() req,
    @Query() query: FiltersTemplateGetAllQueryParams,
  ): Promise<FiltersTemplate[]> {
    return this.filtersTemplateService.findAll({
      where: { created_by: req.user.id, template_type: query.template_type },
    });
  }

  @Get('/:id')
  async findById(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FiltersTemplate> {
    return this.filtersTemplateService.findByCondition({
      user: req.user.id,
      id,
    });
  }

  @Post('')
  @ResponseMessageMetadata(APP_MESSAGES.FILTERS_TEMPLATES.CREATED)
  async createFiltersTemplate(
    @Request() req,
    @Body() body: FiltersTemplateDto,
  ): Promise<FiltersTemplate> {
    return this.filtersTemplateService.createFilterTemplate(req.user.id, body);
  }

  @Delete('/:id')
  @ResponseMessageMetadata(APP_MESSAGES.FILTERS_TEMPLATES.DELETED)
  async deleteFiltersTemplateById(
    @Request() req,
    @Param('id',ParseIntPipe) filterTemplateId: number,
  ) {
    return this.filtersTemplateService.deleteFiltersTemplateById(
      req.user.id,
      filterTemplateId,
    );
  }
}
