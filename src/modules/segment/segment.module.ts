import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportJwtModule } from 'src/adapter/passport-jwt/passport-jwt.module';
import { SegmentService } from './segment.service';
import { SegmentController } from './segment.controller';
import { SegmentRepository } from 'src/repositories/segment.repository';
import { Segment } from 'src/entities/segment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Segment]), PassportJwtModule],
  providers: [SegmentService, SegmentRepository],
  controllers: [SegmentController],
  exports: [SegmentService],
})
export class SegmentModule {}
