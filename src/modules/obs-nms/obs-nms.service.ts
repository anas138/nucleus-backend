import { Injectable } from '@nestjs/common';
import { ObsNmsApiService } from './obs-nms-api.service';
import { PortBitsGraphDto } from 'src/dto/obs-nms/port-bits-graph.dto';

@Injectable()
export class ObsNmsService {
  constructor(private obsNmsApiService: ObsNmsApiService) {}

  async getAllDevices() {
    const data = await this.obsNmsApiService.get('/devices');
    return data;
  }

  async getDeviceById(id: number) {
    const url = `/devices/${id}`;
    return this.obsNmsApiService.get(url);
  }

  async getAlertById(alertId: number) {
    const url = `/alerts/${alertId}`;
    const alert = await this.obsNmsApiService.get(url);
    return alert;
  }

  async getAlertCheckerById(alertCheckerId) {
    const url = `unknown/${alertCheckerId}`;
    return await this.obsNmsApiService.get(url);
  }

  async getPortBitsGraph(portId: any, query: PortBitsGraphDto) {
    const queryObj = {
      id: portId,
      type: 'port_bits',
    };
    Object.assign(queryObj, query);
    // period: query.period?.toString() || '604800',
    const bufferData = await this.obsNmsApiService.getGraph(
      `/graph.php?${new URLSearchParams(queryObj).toString()}`,
      'arraybuffer',
    );
    return Buffer.from(bufferData);
  }
}
