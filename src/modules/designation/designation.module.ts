import { Module } from '@nestjs/common';
import { DesignationController } from './designation.controller';
import { DesignationService } from './designation.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Designation } from 'src/entities/designation.entity';
import { DesignationRepository } from 'src/repositories/designation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Designation]), UserModule],
  controllers: [DesignationController],
  providers: [DesignationService, DesignationRepository],
})
export class DesignationModule {}
