import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadFile } from 'src/entities/upload-file.entity';
import { UploadFileModel } from 'src/models/upload-file.model';
import { Repository } from 'typeorm';

@Injectable()
export class uploadFileRepository {
  constructor(
    @InjectRepository(UploadFile)
    private uploadFileRepo: Repository<UploadFile>,
  ) {}

  async saveFileInfo(
    uploadFileModel: UploadFileModel,
  ): Promise<UploadFileModel> {
    return this.uploadFileRepo.save(uploadFileModel);
  }

  async findFileByID(id: number) {
    return this.uploadFileRepo.findOne({
      where: {
        id,
      },
    });
  }

  async findFileByName(name: string) {
    return this.uploadFileRepo.findOne({
      where: {
        name,
      },
    });
  }
}
