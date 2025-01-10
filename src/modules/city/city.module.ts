import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { CityRepository } from './city.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/entities/city.entity';
import { Country } from 'src/entities/country.entity';
import { Province } from 'src/entities/province.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, Province, Country])],
  providers: [CityService, CityRepository],
  controllers: [CityController],
  exports: [CityService],
})
export class CityModule {}
