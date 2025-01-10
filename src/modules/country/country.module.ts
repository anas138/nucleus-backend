import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { CountryRepository } from './country.repository';
import { Country } from 'src/entities/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountryService, CountryRepository],
  controllers: [CountryController],
  exports: [CountryService],
})
export class CountryModule {}
