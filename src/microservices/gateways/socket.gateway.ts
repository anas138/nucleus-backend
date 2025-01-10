import { UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Observable } from 'rxjs';

import { Server } from 'socket.io';
import { APP_CONSTANTS } from 'src/common/enums/enums';
import { AuthenticatedSocket } from './redis-adapter/redis-adapter';
import { SocketGatewayService } from './services/socket.gateway.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class SocketGateway implements OnGatewayDisconnect, OnGatewayConnection {
  public constructor(
    private readonly socketGatewayService: SocketGatewayService,
  ) {}
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  @WebSocketServer()
  server: Server;

  handleDisconnect(client: any) {
    console.log(
      'User disconnected socket: ',
      client.id,
      ' user-id: ',
      client.auth?.userId,
    );
    this.socketGatewayService.manageSocketsCount('disconnect');
  }
  handleConnection(client: AuthenticatedSocket) {
    if (client.auth?.userId) {
      this.server.socketsJoin(
        APP_CONSTANTS.WEBSOCKET_ROOMS.USER_IDS_ROOM(client.auth.userId),
      );
      this.socketGatewayService.manageSocketsCount('connect');
    }
  }

  @SubscribeMessage('message')
  public sendMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Observable<any> {
    data.fromUserId = client.auth?.userId;
    data.created_at = new Date();
    if (data.userId) {
      console.log(APP_CONSTANTS.WEBSOCKET_ROOMS.USER_IDS_ROOM(data.userId));
      this.socketGatewayService.emitToRoom(
        APP_CONSTANTS.WEBSOCKET_ROOMS.USER_IDS_ROOM(data.userId),
        APP_CONSTANTS.WEBSOCKET_EVENTS.MESSAGE,
        data,
      );
    }
    return data;
  }

  @SubscribeMessage('send-nce-alarm')
  sendNceAlarm(@MessageBody() data: any) {
    this.socketGatewayService.broadcastEvent({
      event: APP_CONSTANTS.WEBSOCKET_EVENTS.NCE_ALARMS,
      data: data,
    });
  }

  @SubscribeMessage('send-obs-alarm')
  sendObsAlarm(@MessageBody() data: any) {
    this.socketGatewayService.broadcastEvent({
      event: APP_CONSTANTS.WEBSOCKET_EVENTS.OBS_ALARMS,
      data: data,
    });
  }

  @SubscribeMessage('send-nce-gpon-alarms')
  sendGponAlarm(@MessageBody() data: any) {
    this.socketGatewayService.broadcastEvent({
      event: APP_CONSTANTS.WEBSOCKET_EVENTS.NCE_GPON_ALARMS,
      data: data,
    });
  }

  @SubscribeMessage('send-nokia-txn-alarms')
  sendNokianAlarm(@MessageBody() data: any) {
    this.socketGatewayService.broadcastEvent({
      event: APP_CONSTANTS.WEBSOCKET_EVENTS.NOKIA_TXN_ALARMS,
      data: data,
    });
  }

  @SubscribeMessage('send-ldi-softswitch-alarms')
  sendLdiSoftswitchAlarm(@MessageBody() data: any) {
    this.socketGatewayService.broadcastEvent({
      event: APP_CONSTANTS.WEBSOCKET_EVENTS.LDI_SOFTSWITCH_ALARMS,
      data: data,
    });
  }

  @SubscribeMessage('update-permissions')
  updateUserPermissions(
    @MessageBody() data: { userId: number; permissions: any[] },
  ) {
    this.socketGatewayService.emitToRoom(
      APP_CONSTANTS.WEBSOCKET_ROOMS.USER_IDS_ROOM(data.userId),
      APP_CONSTANTS.WEBSOCKET_EVENTS.SYNC_USER_PERMISSIONS,
      data,
    );
  }

  @SubscribeMessage(APP_CONSTANTS.WEBSOCKET_EVENTS.WEBAPP_UPDATE)
  sendWebappUpdateEvent(@MessageBody() data: any) {
    this.socketGatewayService.broadcastEvent({
      event: APP_CONSTANTS.WEBSOCKET_EVENTS.WEBAPP_UPDATE,
      data: data,
    });
  }

  @SubscribeMessage('join_room')
  joinRoomAppNotification(@MessageBody() data: any) {
    this.server.socketsJoin(data.room);
  }

  @SubscribeMessage('trouble_ticket_notification')
  appNotifications(@MessageBody() data: any) {
    console.log(data, 'app notifications');
  }
}
