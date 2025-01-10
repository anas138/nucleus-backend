import { AuthTypes } from 'src/common/enums/enums';

export class UserSessionModel {
  user_id: number;
  token: string;
  ip?: string;
  client?: string;
  status?: AuthTypes;
  login_time?: Date;
  logout_time?: Date;
  creation_time?: Date;
  modified_time?: Date;
}
