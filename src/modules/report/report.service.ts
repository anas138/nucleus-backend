import { Injectable } from '@nestjs/common';
import { TroubleTicketService } from '../trouble-ticket/trouble-ticket.service';
import { ReportModel } from 'src/models/report.model';

@Injectable()
export class ReportService {
  constructor(private readonly troubleTicketService: TroubleTicketService) {}

  async generateCSV(body: ReportModel, user) {
    const csvData = await this.troubleTicketService.generateReport(body, user);
    const modifiedData = await this.transformCSVData(csvData, body);
    return await this.troubleTicketService.generateCSV(modifiedData);
  }

  async transformCSVData(csvData: any, body: any) {
    const modifiedData = csvData.map((data) => {
      const filterData = body.columns.map((orderColumn) => {
        const findColumn = Object.entries(data).find(
          ([key, value]) => key === orderColumn.key,
        );
        if (findColumn) {
          const modifyData = findColumn.map((col) => {
            if (col === orderColumn.key) {
              col = orderColumn.columnLabel;
            }
            if (col === null) {
              col = '';
            }
            return col;
          });
          return modifyData;
        }
      });
      return Object.fromEntries(filterData);
    });

    return modifiedData;
  }
}
