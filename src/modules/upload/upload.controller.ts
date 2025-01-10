import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { join } from 'path';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { FileApiService } from './upload-file-api.service';
import { UploadFileModel } from 'src/models/upload-file.model';

@Controller('upload')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class UploadController {
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly fileApiService: FileApiService,
  ) {}

  @Post()
  @ResponseMessageMetadata(APP_MESSAGES.UPLOAD.FILE_UPLOADED)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<UploadFileModel> {
    const data = await this.fileApiService.uploadFile(file);
    return this.uploadFileService.saveFileInfo(file, req.user.id, data.url);
  }

  @Get('/id/:id')
  @ResponseMessageMetadata(APP_MESSAGES.UPLOAD.FILE_FETCHED)
  async getFileById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.uploadFileService.getFileById(id);
    const { url: filePath } = file;
    res.contentType(file.mime);
    return res.sendFile(join(process.cwd(), filePath));
  }

  @Get('/name/:fileName')
  @ResponseMessageMetadata(APP_MESSAGES.UPLOAD.FILE_FETCHED)
  async getFileByName(
    @Param('fileName') fileName: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.uploadFileService.getFileByName(fileName);
    const { url: filePath } = file;
    res.contentType(file.mime);
    return res.sendFile(join(process.cwd(), filePath));
  }
}
