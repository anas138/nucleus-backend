import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as requestIp from 'request-ip';
import { ClientInfoModel } from 'src/models/client-info.modle';
@Injectable()
export class RequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';

    const clientInfo: ClientInfoModel = {
      ip: requestIp.getClientIp(req),
      agent: req.headers['user-agent'],
    };

    req.clientInfo = clientInfo;

    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} from ${ip} - ${userAgent}`,
    );
    return next.handle();
  }
}
