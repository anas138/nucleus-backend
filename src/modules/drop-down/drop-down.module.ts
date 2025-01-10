import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropDownCategory } from 'src/entities/drop-down-category.entity';
import { DropDownItem } from 'src/entities/drop-down-item.entity';
import { DropDownItemsService } from './drop-down-item.service';
import { DropDownRepository } from './drop-down.repository';
import { DropDownItemsController } from './drop-down-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DropDownCategory, DropDownItem])],
  controllers: [DropDownItemsController],
  providers: [DropDownItemsService, DropDownRepository],
  exports: [DropDownItemsService],
})
export class DropDownModule {}
