import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadFileService } from './upload-file.service';
import { uploadFileRepository } from './upload-file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFile } from 'src/entities/upload-file.entity';
import { UploadFileMap } from 'src/entities/upload-file-map.entity';
import { EnvironmentConfigModule } from 'src/config/environment-config/environment-config.module';
import { uploadFileMapRepository } from './upload-file-map.repository';
import { UploadFileMapService } from './upload-file-map.service';
import { FileApiService } from './upload-file-api.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadFile, UploadFileMap]),
    EnvironmentConfigModule,
  ],
  controllers: [UploadController],
  providers: [
    UploadFileService,
    uploadFileRepository,
    uploadFileMapRepository,
    UploadFileMapService,
    FileApiService,
  ],
  exports: [UploadFileMapService, UploadFileService],
})
export class UploadModule {}
