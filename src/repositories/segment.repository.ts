import { BaseAbstractRepository } from './base/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment } from 'src/entities/segment.entity';

export class SegmentRepository extends BaseAbstractRepository<Segment> {
  constructor(
    @InjectRepository(Segment)
    private readonly segmentRepository: Repository<Segment>,
  ) {
    super(segmentRepository);
  }
}
