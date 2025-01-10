import { UnsupportedMediaTypeException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { v4 as uuidv4 } from 'uuid';
import { allowedTypes } from './mimetype.config';
import { EnvironmentConfigService } from './environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';

const configService = new EnvironmentConfigService(new ConfigService());

export const multerConfig = {
  storage: diskStorage({
    destination: configService.getUploadDestination(),
    filename: (req, file, callback) => {
      const randomName = uuidv4();
      callback(null, `${randomName}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: configService.getMaxFileSize(),
  },
  fileFilter: (req, file, callback) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new UnsupportedMediaTypeException(
          APP_MESSAGES.UPLOAD.ERROR_UNKNOW_FILE_TYPE,
        ),
      );
    }
    callback(null, true);
  },
};
