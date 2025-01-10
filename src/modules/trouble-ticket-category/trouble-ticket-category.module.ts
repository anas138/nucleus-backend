import { Module } from '@nestjs/common';
import { TroubleTicketCategoryController } from './trouble-ticket-category.controller';
import { TroubleTicketCategoryRepository } from './trouble-ticket-category.repositroy';
import { TroubleTicketCategoryService } from './trouble-ticket-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TroubleTicketCategory } from 'src/entities/trouble-ticket-catagory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TroubleTicketCategory])],
  controllers: [TroubleTicketCategoryController],
  providers: [TroubleTicketCategoryRepository, TroubleTicketCategoryService],
  exports: [TroubleTicketCategoryService, TroubleTicketCategoryRepository],
})
export class TroubleTicketCategoryModule {}
