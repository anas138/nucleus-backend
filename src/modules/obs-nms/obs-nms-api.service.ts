import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import axios, {
  Axios,
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  ResponseType,
} from 'axios';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';

@Injectable()
export class ObsNmsApiService {
  private axiosInstance: AxiosInstance;
  private axiosInstanceForGraphApi: AxiosInstance;
  constructor(private environmnetConfigService: EnvironmentConfigService) {
    const { username, password } =
      this.environmnetConfigService.getObserviumNmsAuthPayload();
    this.axiosInstance = axios.create({
      baseURL: this.environmnetConfigService.getObserviumNmsBaseUrl(),
      auth: {
        username,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.axiosInstanceForGraphApi = axios.create({
      baseURL: this.environmnetConfigService.getObserviumNmsGraphBaseUrl(),
      auth: {
        username,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.axiosInstance.interceptors.response.use(
      this.responseHandler,
      this.responseErrorHandler,
    );
    this.axiosInstanceForGraphApi.interceptors.response.use(
      this.responseHandler,
      this.responseErrorHandler,
    );
  }
  responseHandler(response: AxiosResponse): AxiosResponse {
    return response;
  }
  responseErrorHandler(error: AxiosError) {
    if (error.response.status === 401) {
      throw new UnauthorizedException(error.response.data);
    }
    throw new ConflictException(error.response.data);
  }

  async get(url: string, responseType: ResponseType = 'json'): Promise<any> {
    const resp = await this.axiosInstance.get(url, {
      responseType: responseType,
    });
    if (resp) {
      return resp.data;
    }
    return null;
  }

  async getGraph(
    url: string,
    responseType: ResponseType = 'json',
  ): Promise<any> {
    const resp = await this.axiosInstanceForGraphApi.get(url, {
      responseType: responseType,
    });
    if (resp) {
      return resp.data;
    }
    return null;
  }
}
