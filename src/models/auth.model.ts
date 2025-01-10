import { UserCreatedModel } from './user.model';

export class LoginModel {
  user: UserCreatedModel;
  tokens: {
    access: {
      token: string;
      expiresIn: string;
    };
    refereshToken?: {
      token: string;
      expiresIn: string;
    };
  };
}
