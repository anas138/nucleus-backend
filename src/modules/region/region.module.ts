import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportJwtModule } from 'src/adapter/passport-jwt/passport-jwt.module';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { RegionRepository } from 'src/repositories/region.repository';
import { Region } from 'src/entities/region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Region]), PassportJwtModule],
  providers: [RegionService, RegionRepository],
  controllers: [RegionController],
  exports: [RegionService],
})
export class RegionModule {}
