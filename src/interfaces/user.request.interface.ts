import { Request } from 'express';
import { ClientInfoModel } from 'src/models/client-info.modle';
import { FetchUserModel } from 'src/models/user.model';
export class IUserRequestInterface extends Request {
  user: FetchUserModel;
  clientInfo?: ClientInfoModel;
}
