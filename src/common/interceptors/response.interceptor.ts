import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResponseMessageKey } from '../decorators/response-message.decorator';
import { KeyIgnoreResponseInterceptor } from '../decorators/ignore-res-interceptor.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger();
  private readonly reflector = new Reflector();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const responseMessage =
      this.reflector.get<string>(ResponseMessageKey, context.getHandler()) ||
      '';
    const ignoreMetaProperty: boolean =
      this.reflector.get<boolean>(
        KeyIgnoreResponseInterceptor,
        context.getHandler(),
      ) || false;
    if (!ignoreMetaProperty) {
      return next.handle().pipe(
        map((data) => {
          return {
            success: true,
            message: responseMessage,
            data: data,
          };
        }),
        catchError(this.errorHandler),
      );
    } else {
      return next.handle();
    }
  }
  errorHandler = (error: any) => {
    if (error instanceof HttpException) {
      this.logger.error('ERROR: ', error.message, 'STACK: ', error.stack);

      const status = error.getStatus();
      const message = error.getResponse()['message'];
      let errorMessage = message;
      if (Array.isArray(message)) {
        errorMessage = message[0];
      }
      throw new HttpException(
        { success: false, status, message: errorMessage },
        status,
      );
    } else if (error.message.includes('ER_DUP_ENTRY')) {
      const status = 409;
      const message = 'Duplicate Entry';
      throw new HttpException({ success: false, status, message }, status);
    } else {
      console.log(error.message);
      // Handle other exceptions
      const status = 500;
      const message = error.message || 'Internal Server Error';
      throw new HttpException({ success: false, status, message }, status);
    }
  };
}
