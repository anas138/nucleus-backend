import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fileURLToPath } from 'url';
import { ReturnTroubleTicketModel } from 'src/models/trouble-ticket.model';

@Injectable()
export class FilterResponseInterceptor<T extends ReturnTroubleTicketModel>
  implements NestInterceptor
{
  constructor(private readonly model: T) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
   
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => this.filterFields(item));
        } else {
          return this.filterFields(data);
        }
      }),
    );
  }

  private filterFields(obj: any): any {
    let filteredObj: any = {};
    const modelFields = Object.keys(this.model);
    for (const field of modelFields) {
      if (obj.hasOwnProperty(field)) {
        if (typeof this.model[field] === 'object') {
          const nestedEntries = Object.keys(this.model[field]);
          for (let keys of nestedEntries) {
            if (obj[field]?.hasOwnProperty(keys)) {
              filteredObj = {
                ...filteredObj,
                [field]: { ...filteredObj[field], [keys]: obj[field][keys] },
              };
            }
          }
        } else {
          filteredObj[field] = obj[field];
        }

        if (Array.isArray(this.model[field])) {
          filteredObj[field] = obj[field];
        }
      }
    }

    return filteredObj;
  }
}
