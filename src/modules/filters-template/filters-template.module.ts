import { Module } from '@nestjs/common';
import { FiltersTemplateController } from './filters-template.controller';
import { FiltersTemplateService } from './filters-template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiltersTemplate } from 'src/entities/filters-template';
import { FiltersTemplateRepository } from 'src/repositories/filters-template.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FiltersTemplate])],
  controllers: [FiltersTemplateController],
  providers: [FiltersTemplateService, FiltersTemplateRepository],
})
export class FiltersTemplateModule {}
