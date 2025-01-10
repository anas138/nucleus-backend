import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { uploadFileRepository } from './upload-file.repository';
import {
  UploadFileModel,
  transformFileToUploadFile,
} from 'src/models/upload-file.model';

import { APP_MESSAGES } from 'src/common/enums/enums';

@Injectable()
export class UploadFileService {
  constructor(private uploadFileRepo: uploadFileRepository) {}
  async saveFileInfo(
    file: Express.Multer.File,
    userId: number,
    url: string,
  ): Promise<UploadFileModel> {
    const uploadFileModel: UploadFileModel = {
      ...transformFileToUploadFile(file),
      url: url,
      created_by: userId,
    };
    return await this.uploadFileRepo.saveFileInfo(uploadFileModel);
  }

  async getFileById(id: number): Promise<UploadFileModel> {
    const file = await this.uploadFileRepo.findFileByID(id);
    if (file) {
      return file;
    } else {
      throw new NotFoundException(APP_MESSAGES.UPLOAD.ERROR_FILE_NOT_FOUND);
    }
  }

  async getFileByName(fileName: string): Promise<UploadFileModel> {
    const file = await this.uploadFileRepo.findFileByName(fileName);
    if (file) {
      return file;
    } else {
      throw new NotFoundException(APP_MESSAGES.UPLOAD.ERROR_FILE_NOT_FOUND);
    }
  }
}
