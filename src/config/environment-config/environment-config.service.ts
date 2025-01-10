import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { milliseconds, seconds } from 'src/common/enums/enums';
import { INCEAuthPayload } from 'src/interfaces/nce-auth-payload.interface';

@Injectable()
export class EnvironmentConfigService {
  constructor(private configService: ConfigService) { }

  getPORT(): string {
    return this.configService.get<string>('PORT');
  }

  getNodeEnvironment(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  getAppEnv(): string {
    return this.configService.get<string>('APP_ENV');
  }

  getKafkaHost(): string {
    return this.configService.get<string>('KAFKA_HOST');
  }

  getRedisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }
  getRedisPort(): string {
    return this.configService.get<string>('REDIS_PORT');
  }

  getJWT_SECRET() {
    return this.configService.get<string>('JWT_SECRET');
  }
  getJWT_EXPIRATION_TIME(): seconds {
    return this.configService.get<seconds>('JWT_EXPIRATION_TIME');
  }
  getDatabaseType(): any {
    return this.configService.get<string>('DATABASE_TYPE');
  }
  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }
  getRUN_SEED(): boolean {
    return this.configService.get<boolean>('RUN_SEED');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT');
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USERNAME');
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }

  getDatabaseSync(): boolean {
    return (
      this.configService.get<string>('DATABASE_SYNCHRONIZE').trim() === 'true'
    );
  }

  isDatabaseLoggingEnabled(): boolean {
    return this.configService.get<string>('DATABASE_LOGGING').trim() === 'true';
  }

  isKafkaEnabled(): boolean {
    return this.configService.get<string>('KAFKA_ENABLED').trim() === 'true';
  }

  getIsNucleusListnerEnabled(): boolean {
    return (
      this.configService.get<string>('NUCLEUS_LISTENER_ENABLED').trim() ===
      'true'
    );
  }
  isListenerKafkaEnabled(): boolean {
    return (
      this.configService
        .get<string>('NUCLEUS_LISTENER_KAFKA_ENABLED')
        .trim() === 'true'
    );
  }
  getIsNucleusAppEnabled(): boolean {
    return (
      this.configService.get<string>('NUCLEUS_APP_ENABLED').trim() === 'true'
    );
  }

  getWebBaseUrl(): string {
    return this.configService.get<string>('NUCLEUS_WEB_BASE_URL');
  }
  getListenerBaseUrl(): string {
    return this.configService.get<string>('NUCLEUS_LISTENER_BASE_URL');
  }

  getNceNmsBaseUrl(): string {
    return this.configService.get<string>('NCE_NMS_BASE_URL');
  }

  getObserviumNmsBaseUrl(): string {
    return this.configService.get<string>('OBSERVIUM_NMS_BASE_URL');
  }
  getObserviumNmsGraphBaseUrl(): string {
    return this.configService.get<string>('OBSERVIUM_NMS_GRAPH_BASE_URL');
  }

  getNCEAuthPayload(): INCEAuthPayload {
    return {
      grantType: 'password',
      userName: this.configService.get<string>('NCE_NMS_USERNAME'),
      value: this.configService.get<string>('NCE_NMS_PASSWORD'),
    };
  }
  getObserviumNmsAuthPayload(): IOBSAuthPayload {
    return {
      username: this.configService.get<string>('OBSERVIUM_NMS_USERNAME'),
      password: this.configService.get<string>('OBSERVIUM_NMS_PASSWORD'),
    };
  }
  getUploadDestination(): string {
    return join(__dirname, '..', '..', '..', 'uploads');
  }
  getUploadFolderName(): string {
    return this.configService.get<string>('UPLOAD_DESTINATION');
  }
  getMaxFileSize(): number {
    return this.configService.get<number>('MAX_FILE_SIZE_IN_BYTES');
  }
  getSmtpUsername(): string {
    return this.configService.get<string>('SMTP_USERNAME');
  }
  getSmtpPassword(): string {
    return this.configService.get<string>('SMTP_PASSWORD');
  }
  getIsSmtpTestingAccount(): boolean {
    return (
      this.configService.get<string>('SMTP_TESTING_ACCOUNT').trim() === 'true'
    );
  }
  getIfApplyAlarmRules(): boolean {
    return this.configService.get<boolean>('APPLY_ALARM_RULES');
  }

  shouldDelayAlarmActions(): boolean {
    return this.configService.get<boolean>('DELAY_ALARM_ACTIONS');
  }

  getIfEmailNotificationToBeSent(): boolean {
    return this.configService.get<boolean>('SEND_EMAIL_NOTIFICATION');
  }

  getIfEmailNotificationToBeSentOnUserCreation(): boolean {
    return this.configService.get<boolean>(
      'SEND_EMAIL_NOTIFICATION_ON_USER_CREATE',
    );
  }

  getMongoUrl(): string {
    return this.configService.get<string>('LISTENER_MONGO_DB_URL');
  }

  getSessionIdleTimeout(): number {
    return parseInt(this.configService.get('SESSION_IDLE_TIMEOUT_MINUTES'));
  }

  getFileServerUrl() {
    return this.configService.get<string>('FILE_SERVER_URL');
  }

  getTroubleTicketEmailRoute() {
    return this.configService.get<string>('TROUBLE_TICKET_EMAIL_ROUTE');
  }
  getTroubleTicketNotificationRoute() {
    return this.configService.get<string>('TROUBLE_TICKET_NOTIFICATION_ROUTE');
  }
  getSmsApiKey() {
    return this.configService.get<string>('SMS_API-KEY');
  }
  getSmSUrl() {
    return this.configService.get<string>('SMS_API_URL');
  }

  getIfSmsNotificationToBeSent(): boolean {
    return (
      this.configService.get<string>('SEND_SMS_NOTIFICATION').trim() === 'true'
    );
  }
  getMsGraphApiBaseUrl() {
    return this.configService.get<string>('MS_GRAPH_API_URL');
  }
}
