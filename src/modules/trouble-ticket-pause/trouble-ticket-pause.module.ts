import { Module, forwardRef } from '@nestjs/common';
import { TroubleTicketPauseController } from './trouble-ticket-pause.controller';
import { TroubleTicketPauseRepository } from './trouble-ticket-pause.repository';
import { TroubleTicketPauseService } from './trouble-ticket-pause.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TroubleTicketPause } from 'src/entities/trouble-ticket-pause.entity';
import { TroubleTicketModule } from '../trouble-ticket/trouble-ticket.module';
import { UserModule } from '../user/user.module';
import { TroubleTicketAssignedModule } from '../trouble-ticket-assigned/trouble-ticket-assigned.module';
import { PauseTicketQueueModule } from 'src/microservices/queues/pause-ticket/pause-ticket.module';
import { SubDepartmentModule } from '../sub-department/sub-department.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TroubleTicketPause]),
    TroubleTicketModule,
    UserModule,
    TroubleTicketAssignedModule,
    forwardRef(() => PauseTicketQueueModule),
    SubDepartmentModule,
  ],
  controllers: [TroubleTicketPauseController],
  providers: [TroubleTicketPauseService, TroubleTicketPauseRepository],
  exports: [TroubleTicketPauseService, TroubleTicketPauseRepository],
})
export class TroubleTicketPauseModule {}
