import { Module } from '@nestjs/common';
import { SocketGatewayService } from './socket.gateway.service';
import { CacheManagerService } from 'src/common/cache/cache-manager.service';

@Module({
  providers: [SocketGatewayService, CacheManagerService],
  exports: [SocketGatewayService],
})
export class GatewayServiceModule {}
