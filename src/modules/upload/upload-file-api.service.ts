import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { createReadStream, unlinkSync } from 'fs';
import * as FormData from 'form-data';
import * as https from 'https';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';

@Injectable()
export class FileApiService {
  private axiosInstance: AxiosInstance;
  constructor(private environmentConfigService: EnvironmentConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.environmentConfigService.getFileServerUrl(),
    });
  }

  async uploadFile(file: any) {
    const formData = new FormData();

    formData.append('file', createReadStream(file.path));

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const request_config = {
      headers: { ...formData.getHeaders() },
      httpsAgent: agent,
      maxBodyLength: Infinity,
    };
    const { data } = await this.axiosInstance.post(
      '/',
      formData,
      request_config,
    );
    unlinkSync(file.path);
    // const updated = {
    //   ...data.file,
    //   url: `${this.environmentConfigService.getFileServerUrl()}/${
    //     data.file.url
    //   }`,
    // };
    return data.file;
  }
}
