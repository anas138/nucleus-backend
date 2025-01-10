import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import * as fs from 'fs';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("/api/version")
  async getApiVersion() {
    const packageFile = fs.readFileSync(
      join(`${__dirname}/../package.json`),
      'utf8',
    );
    const packageJson = JSON.parse(packageFile)
    return { version: packageJson.version }
  }

}
