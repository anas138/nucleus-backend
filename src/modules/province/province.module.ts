import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceRepository } from './province.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from 'src/entities/province.entity';
import { Country } from 'src/entities/country.entity';
import { ProvinceService } from './province.service';

@Module({
  imports: [TypeOrmModule.forFeature([Province, Country])],
  providers: [ProvinceService, ProvinceRepository],
  controllers: [ProvinceController],
  exports: [ProvinceService],
})
export class ProvinceModule {}
