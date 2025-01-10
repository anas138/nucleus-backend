import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import * as https from 'https';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { INceAuthErrorResponse } from 'src/interfaces/nce-auth-error-response.interface';

@Injectable()
export class NceNmsApiService {
  private token: string;
  private axiosInstance: AxiosInstance;
  constructor(
    private readonly envConfigService: EnvironmentConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.axiosInstance = axios.create({
      baseURL: envConfigService.getNceNmsBaseUrl(),
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    this.axiosInstance.interceptors.request.use((value) => {
      value.headers['Content-Type'] = 'application/json';
      value.headers['X-AUTH-TOKEN'] = this.token;
      return value;
    });
    this.axiosInstance.interceptors.response.use(
      this.responseHandler,
      this.responseErrorHandler,
    );
  }
  responseHandler = (response: AxiosResponse): AxiosResponse => {
    return response;
  };
  responseErrorHandler = async (error: AxiosError) => {
    const errorReponse: INceAuthErrorResponse = error.response.data
    if ([401, 403].includes(error.response.status)) {
      await this.deleteToken();
      throw new Error(error.response?.data['description']);
    } else if (error.response.status === 409) {
      console.log('error', error.response.statusText);
    } else {
      console.log('error', error.response.statusText);
      throw new Error(`Unable to connect with NCE: Exception ID: ${errorReponse.exceptionId}`);
    }
  };
  private async authenticate(): Promise<any> {
    let token = await this.getToken();
    if (!token) {
      console.log('NCE-AUTH-CALLED');
      const resp = await this.put(
        '/rest/plat/smapp/v1/sessions',
        this.envConfigService.getNCEAuthPayload(),
      );
      token = resp.accessSession;
      await this.updateToken(token);
    }
    this.token = token;
    this.axiosInstance.defaults.headers['X-AUTH-TOKEN'] = token;
  }

  async get(url: string): Promise<any> {
    await this.authenticate();
    const resp = await this.axiosInstance.get(url);
    return resp ? resp.data : null;
  }

  async put(url: string, payload: object): Promise<any> {
    const resp = await this.axiosInstance.put(url, payload);
    return resp.data;
  }

  async getToken(): Promise<string> {
    return this.cacheManager.get<string>('nce-token');
  }

  async updateToken(token: string): Promise<void> {
    await this.cacheManager.set('nce-token', token);
  }

  async deleteToken(): Promise<void> {
    await this.cacheManager.del('nce-token');
  }
}
