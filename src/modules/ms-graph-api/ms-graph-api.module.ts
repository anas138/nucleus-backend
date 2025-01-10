import { Module } from '@nestjs/common';
import { MsGraphApiService } from './ms-graph-api.service';

@Module({
  providers: [MsGraphApiService],
  exports: [MsGraphApiService],
})
export class MsGraphApiModule {}
