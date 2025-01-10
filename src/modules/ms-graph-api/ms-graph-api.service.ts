import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
const configService = new EnvironmentConfigService(new ConfigService());

@Injectable()
export class MsGraphApiService {
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: configService.getMsGraphApiBaseUrl(),
    });
  }

  setAccessToken(token: string) {
    this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    this.axiosInstance.defaults.responseType = 'arraybuffer';
  }

  async getProfilePicture() {
    try {
      const response = await this.axiosInstance.get('/me/photo/$value');
      const buffer = Buffer.from(response.data, 'binary');
      const base64Image = buffer.toString('base64');
      const imageSrc = `data:${response.headers['content-type']};base64,${base64Image}`;

      return imageSrc;
    } catch (error) {
      console.log('MS-Graph-API Error: ', error)
      return null
    }
  }
}
