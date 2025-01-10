import { Request } from 'express';
import { ClientInfoModel } from 'src/models/client-info.modle';

export class IPublicRequest extends Request {
  clientInfo: ClientInfoModel;
}
