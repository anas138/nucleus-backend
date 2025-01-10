import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadFileMap } from 'src/entities/upload-file-map.entity';
import { UploadFile } from 'src/entities/upload-file.entity';
import { UploadFileMapModel } from 'src/models/upload-file-map.model';
import { UploadFileModel } from 'src/models/upload-file.model';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class uploadFileMapRepository extends BaseAbstractRepository<UploadFileMap> {
  constructor(
    @InjectRepository(UploadFileMap)
    private uploadFileMapRepo: Repository<UploadFileMap>,
  ) {
    super(uploadFileMapRepo);
  }
  async saveFileInfo(
    uploadFileMapModel: UploadFileMapModel,
  ): Promise<UploadFileMapModel> {
    return this.uploadFileMapRepo.save(uploadFileMapModel);
  }
}
