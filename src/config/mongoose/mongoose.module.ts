import { Module } from '@nestjs/common';
import { mongooseProviders } from './mongoose.provider';

@Module({
  providers: [...mongooseProviders],
  exports: [...mongooseProviders],
})
export class MongooseConfigModule {}
