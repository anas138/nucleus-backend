import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { CacheManagerService } from 'src/common/cache/cache-manager.service';

interface BroadcastEventEmitDTO {
  readonly event: string;
  readonly data: unknown;
}

@Injectable()
export class SocketGatewayService {
  private socketServer: Server;

  public constructor(
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  public injectSocketServer(server: Server): SocketGatewayService {
    this.socketServer = server;
    return this;
  }

  /**
   * @description Keep connected/disconnected sockets count in cache
   * @param event
   */
  public async manageSocketsCount(event: 'disconnect' | 'connect') {
    if (event === 'disconnect') {
      let socketsCount = await this.cacheManagerService.get(`sockets-count`);
      socketsCount = socketsCount ? parseInt(socketsCount) - 1 : 1;
      await this.cacheManagerService.set('sockets-count', socketsCount);
      console.log('socketsCount', socketsCount);
    } else if (event === 'connect') {
      let socketsCount = await this.cacheManagerService.get(`sockets-count`);
      socketsCount = socketsCount ? parseInt(socketsCount) + 1 : 1;
      await this.cacheManagerService.set('sockets-count', socketsCount);
      console.log('socketsCount', socketsCount);
    }
  }

  /**
   *
   * @param room "room-id"
   * @param event
   * @param data
   * @returns
   */
  public emitToRoom(room: string, event: string, data: any): boolean {
    this.socketServer.to(room).emit(event, data);
    return true;
  }

  public broadcastEvent(eventInfo: BroadcastEventEmitDTO) {
    this.socketServer.emit(eventInfo.event, eventInfo.data);
    return true;
  }
}
