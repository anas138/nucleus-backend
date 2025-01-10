import { Inject, Injectable } from '@nestjs/common';
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  ResponseType,
} from 'axios';
import * as https from 'https';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ListenerApiService {
  private token: string;
  private axiosInstance: AxiosInstance;
  constructor(
    private readonly envConfigService: EnvironmentConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.axiosInstance = axios.create({
      baseURL: envConfigService.getListenerBaseUrl(),
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    this.axiosInstance.interceptors.request.use((value) => {
      value.headers['Content-Type'] = 'application/json';
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
    if (error.response.status === 401) {
      await this.deleteToken();
      throw new Error(error.response?.data['description']);
    } else if (error.response.status === 409) {
      console.log('error', error.response.statusText);
    } else {
      console.log('error', error.response.statusText);
      throw new Error('Unable to connect with Listener Instance');
    }
  };
  private async authenticate(): Promise<any> {
    let token = await this.getToken();
    if (!token) {
      // console.log('NCE-AUTH-CALLED');
      // const resp = await this.put(
      //   '/rest/plat/smapp/v1/sessions',
      //   this.envConfigService.getNCEAuthPayload(),
      // );
      // token = resp.accessSession;
      // await this.updateToken(token);
    }
    // this.token = token;
    this.axiosInstance.defaults.headers['AUTHORIZATION'] = token;
  }

  async get(url: string, responseType: ResponseType = 'json'): Promise<any> {
    // await this.authenticate();
    const resp = await this.axiosInstance.get(url, { responseType });
    return resp ? resp.data : null;
  }

  async put(url: string, payload: object): Promise<any> {
    const resp = await this.axiosInstance.put(url, payload);
    return resp.data;
  }

  async getToken(): Promise<string> {
    return this.cacheManager.get<string>('listener-token');
  }

  async updateToken(token: string): Promise<void> {
    await this.cacheManager.set('listener-token', token);
  }

  async deleteToken(): Promise<void> {
    await this.cacheManager.del('listener-token');
  }
}
