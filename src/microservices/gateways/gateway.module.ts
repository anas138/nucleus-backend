import { Module } from '@nestjs/common';
import { SharedModule } from 'src/modules/shared/shared.module';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [SharedModule],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class GatewayModule {}
