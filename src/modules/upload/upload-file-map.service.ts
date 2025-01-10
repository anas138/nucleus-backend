import { Injectable } from '@nestjs/common';
import { uploadFileRepository } from './upload-file.repository';
import { uploadFileMapRepository } from './upload-file-map.repository';
import { UploadFileMapModel } from 'src/models/upload-file-map.model';
import { BaseService } from 'src/common/services/base.service';
import { UploadFileMap } from 'src/entities/upload-file-map.entity';

@Injectable()
export class UploadFileMapService extends BaseService<UploadFileMap> {
  constructor(private uploadFileMapRepo: uploadFileMapRepository) {
    super(uploadFileMapRepo);
  }

  async saveFileMapInfo(
    uploadFileMapModel: UploadFileMapModel,
  ): Promise<UploadFileMapModel> {
    return this.uploadFileMapRepo.saveFileInfo(uploadFileMapModel);
  }
}
