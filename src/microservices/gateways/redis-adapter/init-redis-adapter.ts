import { INestApplication } from '@nestjs/common';
import { RedisIoAdapter } from './redis-adapter';
import { SocketGatewayService } from '../services/socket.gateway.service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { RedisCacheService } from 'src/common/redis/redis-cache.service';

/**
 * @description Initialize Socket.io Redis Adapter, and inject websocket server in shareable socket.gateway.service
 * @param app
 * @returns
 */
export const initSocketIoRedisAdapter = async (
  app: INestApplication,
): Promise<INestApplication> => {
  const socketGatewayService = app.get(SocketGatewayService);
  const envConfigService = app.get(EnvironmentConfigService);
  const redisCacheService = app.get(RedisCacheService)

  const redisIoAdapter = new RedisIoAdapter(
    app,
    socketGatewayService,
    envConfigService,
    redisCacheService
  );
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  return app;
};
