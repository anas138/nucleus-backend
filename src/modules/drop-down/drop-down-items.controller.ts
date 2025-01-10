import { Controller, Get, Query } from '@nestjs/common';
import { FetchDropDownItemsDto } from 'src/dto/drop-down/fetch-drop-down-item.dto';
import { DropDownItemsService } from './drop-down-item.service';

@Controller('drop-down-items')
export class DropDownItemsController {
  constructor(private readonly dropDownItemsService: DropDownItemsService) {}

  @Get()
  async getDropDownItemsByCategory(@Query() query: FetchDropDownItemsDto) {
    const { category_constant, category_id } = query;
    return this.dropDownItemsService.getDropDownItemsByCategory(
      category_constant,
      category_id,
    );
  }
}
