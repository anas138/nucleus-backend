import { SetMetadata } from '@nestjs/common';

export const KeyIgnoreResponseInterceptor = 'ignore-res-interceptor-meta';

/**
 * Decorate to set meta-property of route to ignore gloabal response-interceptor
 */

export const SetMetaIgnoreResponseInterceptor = (status: boolean) =>
  SetMetadata(KeyIgnoreResponseInterceptor, status);
