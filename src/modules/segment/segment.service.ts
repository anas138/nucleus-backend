import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Segment } from 'src/entities/segment.entity';
import { SegmentRepository } from 'src/repositories/segment.repository';

@Injectable()
export class SegmentService extends BaseService<Segment> {
  constructor(private readonly segmentRepository: SegmentRepository) {
    super(segmentRepository);
  }
}
