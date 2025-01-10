import { Module } from '@nestjs/common';
import { TroubleTicketAssignedController } from './trouble-ticket-assigned.controller';
import { TroubleTicketAssignedService } from './trouble-ticket-assigned.service';
import { TroubleTicketAssignedRepository } from './trouble-ticket-assigned.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TroubleTicketAssigned } from 'src/entities/trouble-ticket-assigned.entity';
import { UserModule } from '../user/user.module';
import { SubDepartmentModule } from '../sub-department/sub-department.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TroubleTicketAssigned]),
    UserModule,
    SubDepartmentModule,
  ],
  controllers: [TroubleTicketAssignedController],
  providers: [TroubleTicketAssignedService, TroubleTicketAssignedRepository],
  exports: [TroubleTicketAssignedService, TroubleTicketAssignedRepository],
})
export class TroubleTicketAssignedModule {}
