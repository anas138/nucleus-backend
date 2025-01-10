import { Controller } from '@nestjs/common';
import { ProvinceService } from './province.service';

@Controller('Province')
export class ProvinceController {
  constructor(private ProvinceService: ProvinceService) {}
}
