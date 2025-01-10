import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TroubleTicketService } from '../trouble-ticket/trouble-ticket.service';
import { ReportService } from './report.service';

import { ReportModel } from 'src/models/report.model';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('report')
@UseGuards(AuthGuard())
export class ReportController {
  constructor(
    private readonly troubleTicketService: TroubleTicketService,
    private readonly reportService: ReportService,
  ) {}

  @Get('/trouble-ticket')
  async generateTroubleTicketReport(
    @Query() queryParam: ReportModel,
    @Req() req: any,
  ) {
    const { user } = req;
    return this.troubleTicketService.generateReport(queryParam, user);
  }

  @Post('/trouble-ticket/generate-csv')
  async generateTroubleTicketCsv(
    @Res() res: Response,
    @Body() body: ReportModel,
    @Req() req: any,
  ) {
    //const { data } = body;
    //const file = await this.troubleTicketService.generateCSV(data);
    const { user } = req;
    const csv = await this.reportService.generateCSV(body, user);
    res.send(csv);
  }
}
