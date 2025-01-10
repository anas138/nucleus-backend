// import { Injectable, INestMicroservice } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { KafkaConfig } from './config/kafka.config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { EnvironmentConfigService } from './config/environment-config/environment-config.service';
import { RequestInterceptor } from './common/interceptors/request.interceptor';
import { ContentTypeValidationInterceptor } from './common/interceptors/content-type-validation.interceptor';
import { ContentTypeValidationPipe } from './common/pipes/content-type-validation.pipe';
import { initSocketIoRedisAdapter } from './microservices/gateways/redis-adapter/init-redis-adapter';

const configService = new EnvironmentConfigService(new ConfigService());

async function bootstrap() {
  // config();

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      // whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new RequestInterceptor(),
    // new ContentTypeValidationInterceptor(new ContentTypeValidationPipe()),
  );

  /**
   * Start project microservices
   */
  if (configService.isKafkaEnabled()) {
    app.connectMicroservice(KafkaConfig);
  }
  app.startAllMicroservices();

  // init socket-redis-adaptor
  await initSocketIoRedisAdapter(app);

  await app.listen(configService.getPORT(), () => {
    console.log(`Listening on port ${configService.getPORT()}`);
  });
}
bootstrap();
