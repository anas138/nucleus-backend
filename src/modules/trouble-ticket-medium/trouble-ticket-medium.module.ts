import { Module } from '@nestjs/common';
import { TroubleTicketMediumController } from './trouble-ticket-medium.controller';
import { TroubleTicketMediumService } from './trouble-ticket-medium.service';
import { TroubleTicketMediumRepository } from './trouble-ticket-medium.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TroubleTicketMedium } from 'src/entities/trouble-ticket-medium.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TroubleTicketMedium])],
  controllers: [TroubleTicketMediumController],
  providers: [TroubleTicketMediumService, TroubleTicketMediumRepository],
  exports: [TroubleTicketMediumService, TroubleTicketMediumRepository],
})
export class TroubleTicketMediumModule {}
