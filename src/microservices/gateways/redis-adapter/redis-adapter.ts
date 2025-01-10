import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { INestApplication } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { APP_CONSTANTS, APP_MESSAGES } from 'src/common/enums/enums';
import { SocketGatewayService } from '../services/socket.gateway.service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { RedisCacheService } from 'src/common/redis/redis-cache.service';

interface TokenPayload {
  readonly userId: string;
}

export interface AuthenticatedSocket extends Socket {
  auth: TokenPayload;
}
export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  public constructor(
    app: INestApplication,
    private readonly socketGatewayService: SocketGatewayService,
    private envConfigService: EnvironmentConfigService,
    private redisCacheService: RedisCacheService,
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: `redis://${this.envConfigService.getRedisHost()}:${this.envConfigService.getRedisPort()}`,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);

    server.use(async (socket: AuthenticatedSocket, next) => {
      const token =
        socket.handshake.query?.token ||
        socket.handshake.headers?.authorization;

      if (!token) {
        socket.auth = null;

        // not authenticated connection is still valid
        // thus no error
        // const error = new Error('Unauthorized');
        // return next(error);

        // Let clients get connected in open state
        return next();
      }

      try {
        // Validate and decode the JWT token here
        const decodedToken = jwt.verify(
          token.toString(),
          this.envConfigService.getJWT_SECRET(),
        );
        if (!decodedToken || !decodedToken['userId']) {
          const error = new Error(APP_MESSAGES.AUTH.ERROR_TOKEN_INVALID);
          return next(error);
        } else {
          // find in cache if its already set
          const cacheToken = await this.redisCacheService.get(
            APP_CONSTANTS.CACHE_MANAGER.KEYS.WS_USER_TOKEN +
            decodedToken['userId'],
          );
          if (!cacheToken) {
            const error = new Error(APP_MESSAGES.AUTH.ERROR_TOKEN_INVALID);
            return next(error);
          }
        }

        // Assign the validated user information to the socket
        socket.auth = {
          userId: decodedToken['userId'],
        };
        console.log(
          `User CONNECTED - ${socket.id} - user: ${socket.auth.userId}`,
        );

        return next();
      } catch (e) {
        return next(e);
      }
    });

    /**
     * Inject socket server in global shared gateway service
     */
    this.socketGatewayService.injectSocketServer(server);

    return server;
  }
}
