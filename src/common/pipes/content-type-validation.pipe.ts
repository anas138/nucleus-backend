import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { APP_MESSAGES } from '../enums/enums';

@Injectable()
export class ContentTypeValidationPipe implements PipeTransform {
  private allowedContentTypes = ['application/json', 'multipart/form-data'];
  transform(value: any, metadata: ArgumentMetadata) {
    const contentType = metadata?.type?.toLowerCase();

    if (!this.allowedContentTypes.includes(contentType)) {
      throw new BadRequestException(
        APP_MESSAGES.CONTENT_TYPE.ERROR_INVALID_CONTENT_TYPE,
      );
    }
    return value;
  }
}
