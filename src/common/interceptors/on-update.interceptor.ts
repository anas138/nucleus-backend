import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { User } from 'src/entities/user.entity';

@Injectable()
export class OnUpdateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request | any = context.switchToHttp().getRequest();
    const reqMethod = req ? req.method : null;
    if (req && (reqMethod === 'PUT' || reqMethod === 'PATCH')) {
      const user: User = req.user;
      const { body } = req;
      if (body && Object.keys(body).length > 0) {
        req.body = { ...req.body, updated_by: user.id, updated_at: new Date() };
      }
      req.body = { ...req.body, updated_by: user.id, updated_at: new Date() };
    }
    return next.handle();
  }
}
