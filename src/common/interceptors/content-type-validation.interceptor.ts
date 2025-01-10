import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Paramtype,
} from '@nestjs/common';
import { ContentTypeValidationPipe } from '../pipes/content-type-validation.pipe';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ContentTypeValidationInterceptor implements NestInterceptor {
  constructor(private readonly validationPipe: ContentTypeValidationPipe) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'];
    this.validationPipe.transform(contentType, {
      type: contentType,
    });
    return next.handle();
  }
}
