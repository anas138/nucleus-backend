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
export class OnCreateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request | any = context.switchToHttp().getRequest();
    const reqMethod = req ? req.method : null;
    if (req && reqMethod === 'POST') {
      if (req.user) {
        const user: User = req.user;
        const { body } = req;
        if (body && Object.keys(body).length > 0) {
          req.body = { ...req.body, created_by: user.id };
        }
      }
    }

    return next.handle();
  }
}
