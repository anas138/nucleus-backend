import { SetMetadata } from '@nestjs/common';

export const ResponseMessageKey = 'ResponseMessageKey';
export const ResponseMessageMetadata = (message: string) =>
  SetMetadata(ResponseMessageKey, message);
