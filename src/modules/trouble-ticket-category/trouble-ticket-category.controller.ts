import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTroubleTicketCategoryDto } from 'src/dto/trouble-ticket-category/create-trouble-ticket-category.dto';
import { TroubleTicketCategoryService } from './trouble-ticket-category.service';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { TroubleTicketCategory } from 'src/entities/trouble-ticket-catagory.entity';
import { TroubleTicketCategoryModel } from 'src/models/trouble-ticket-category.model';
import { UpdateTroubleTicketCategoryDto } from 'src/dto/trouble-ticket-category/update-trouble-ticket-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';

@Controller('tt-category')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class TroubleTicketCategoryController {
  constructor(
    private readonly troubleTicketCategoryService: TroubleTicketCategoryService,
  ) {}
  @Post()
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET_CATEGORY.CREATED)
  async createTroubleTicketCategory(
    @Body() body: CreateTroubleTicketCategoryDto,
  ): Promise<TroubleTicketCategoryModel> {
    await this.troubleTicketCategoryService.checkDuplicate(
      body.name,
      body.parent_id,
    );
    return this.troubleTicketCategoryService.create(body);
  }

  @Get()
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET_CATEGORY.FETCHED)
  async getCategories() {
    return this.troubleTicketCategoryService.getCategories();
  }

  @Get('/:id')
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET_CATEGORY.FETCHED)
  async getById(@Param('id') id: number) {
    return this.troubleTicketCategoryService.getTroubleTicketById(id);
  }

  @Put('/:id')
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET_CATEGORY.UPDATED)
  async updateCategory(
    @Body() body: UpdateTroubleTicketCategoryDto,
    @Param('id') id: number,
  ) {
    const where: FindOptionsWhere<TroubleTicketCategory> = {
      id: id,
    };
    return this.troubleTicketCategoryService.update(where, body);
  }

  @Delete('/:id')
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET_CATEGORY.DELETED)
  async deleteCategory(@Param('id') id: number) {
    const where = {
      id: id,
    };
    return this.troubleTicketCategoryService.deleteRecord(where);
  }

  @Get('/:id/tat-calculation')
  async getStartTimeEndTime(@Param('id') id: number) {
    return this.troubleTicketCategoryService.getCalculation(id);
  }
}
