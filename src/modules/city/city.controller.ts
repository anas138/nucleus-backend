import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { FetchCityDto } from 'src/dto/city/fetch-city.dto';

@Controller('city')
export class CityController {
  constructor(private cityService: CityService) {}

  @Get('autocomplete')
  async findCities(@Query() fetchCityDto: FetchCityDto) {
    return this.cityService.findCities(fetchCityDto);
  }
}
