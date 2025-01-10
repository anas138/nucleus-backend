import { Injectable } from '@nestjs/common';
import { PaginationQueryModel } from 'src/models/pagination.model';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as shell from 'shelljs';
import * as XLSX from 'xlsx';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { APP_CONSTANTS, CALCULATION } from '../enums/enums';

config();
@Injectable()
export class HelperFunctions {
  constructor() {}

  calculatePagination = (query: PaginationQueryModel) => {
    const { limit, page, ...restOfParams } = query;
    return {
      take: limit,
      skip: (page - 1) * limit,
      ...restOfParams,
    };
  };

  toUTC = (date) => {
    if (!date) {
      return null;
    }
    const inputDate = new Date(date);
    const dateUTC = new Date(
      Date.UTC(
        inputDate.getUTCFullYear(),
        inputDate.getUTCMonth(),
        inputDate.getUTCDate(),
        inputDate.getUTCHours(),
        inputDate.getUTCMinutes(),
        inputDate.getUTCSeconds(),
      ),
    );
    return dateUTC;
  };

  isObjectEmpty = (obj: any) => {
    if (!obj) return true;
    if (!Object.keys(obj).length) return true;
    if (Array.isArray(obj) && !obj.length) return true;
    return false;
  };

  calculatPaginationProperties = (
    total: number,
    take: number,
    skip: number,
  ) => {
    const limit = take;
    const page = skip / take + 1;
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page + 1 > totalPages ? false : true;
    const hasPrevPage = page - 1 < 1 ? false : true;

    return {
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  };
  parseCsv = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error: Error) => reject(error));
    });
  };
  transformAscii = (word: string): string => {
    const normalized = word.normalize('NFD');
    const asciiWord = normalized.replace(/[^\x00-\x7F]/g, '');

    return asciiWord;
  };
  dumpUp = (fileName: string) => {
    const runSqlScript = (filePath: string, callback) => {
      let passwordString: string;
      const isWindowsOS = process.platform === 'win32';

      if (isWindowsOS) {
        passwordString = process.env.DATABASE_PASSWORD
          ? `-p"${process.env.DATABASE_PASSWORD}"`
          : '';
      } else {
        passwordString = process.env.DATABASE_PASSWORD
          ? `-p'${process.env.DATABASE_PASSWORD}'`
          : '';
      }
      const mySQLImportDumpCommand = `mysql -h ${process.env.DATABASE_HOST} -u ${process.env.DATABASE_USERNAME} ${passwordString} ${process.env.DATABASE_NAME} < ${filePath}`;
      console.log('Execution Command : ', mySQLImportDumpCommand);
      if (shell.exec(mySQLImportDumpCommand).code !== 0) {
        throw new Error(
          'error executing command.please check if mysql binary configured properly',
        );
      }
      callback();
    };
    const rebuild = (filePath: string) => {
      runSqlScript(filePath, () => {});
    };
    let filePath = join(process.cwd(), '/src/database/dumps', fileName);
    if (fs.existsSync(filePath)) {
      rebuild(filePath);
    } else {
      throw new Error(`${filePath} does not exist`);
    }
  };

  async readXLSX(filePath) {
    try {
      // Read the XLSX file
      const workbook = XLSX.readFile(filePath);

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        header: 1,
        defval: null,
      });

      const headers: any = jsonData.shift();

      const jsonArray = jsonData.map((row) =>
        headers.reduce((acc, header, index) => {
          acc[header] = row[index];
          return acc;
        }, {}),
      );
      return jsonArray;
    } catch (error) {
      console.error('Error converting XLSX to JSON:', error.message);
    }
  }

  generateUUID() {
    return uuidv4();
  }

  transformDataForDashboardView(data: any, format: string) {
    if (format === APP_CONSTANTS.DASHBOARD_STATS_FROMAT.BAR_CHART) {
      return this.transformDataIntoLabelValue(data);
    }
    if (format === APP_CONSTANTS.DASHBOARD_STATS_FROMAT.KEY_VALUE) {
      return this.transformDataIntoKeyValue(data);
    }
  }

  /**
   *
   * @param data accepts in a format
   * [
   *    { label : "value"},
   *    { label : "value"}
   *    ...
   * ]
   * @returns {
   *      key : value,
   *      key : value
   * }
   */
  transformDataIntoKeyValue(data: Array<any>): Object {
    if (!data) return data;
    if (!data.length) return data;

    let transformedData = {};
    const keys: Array<string> = Object.keys(data[0]);

    for (let obj of data) {
      const key = obj[keys[0]];
      const value = obj[keys[1]];
      transformedData[key] = value;
    }
    return transformedData;
  }

  transformDataIntoLabelValue(data: Array<any>) {
    let dataInLabelValueFormat = {};
    let labelKey: string, valueKey: string;
    if (data && data.length) {
      const keys = Object.keys(data[0]);
      labelKey = keys[0];
      valueKey = keys[1];
    }
    let labels = data.map((item) => {
      return item[labelKey];
    });
    let values = data.map((item) => {
      return item[valueKey];
    });
    return { ...dataInLabelValueFormat, labels, values };
  }

  generateRandomString(length: number) {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
    }
    return randomString;
  }

  calculateStartEndTime(tat: number, tatType: string) {
    const tat_start_time = new Date();

    const tatMilliSecondTime = tat * CALCULATION[`${tatType}`];

    const modifyTime = new Date(
      tat_start_time.getTime() + tat * CALCULATION[`${tatType}`],
    );
    const tat_end_time = new Date(modifyTime);
    return {
      tat_start_time,
      tat_end_time,
      tat: tat,
      tatType: tatType,
      tatMilliSecondTime,
    };
  }

  calculateTimeDifference(startTime: Date, endTime: Date) {
    const fromDate = startTime.getTime(); // Get the milliseconds since epoch for the start time
    const toDate = endTime.getTime(); // Get the milliseconds since epoch for the end time

    const difference = toDate - fromDate; // Calculate the difference in milliseconds

    const totalSeconds = Math.abs(difference) / 1000; // Convert milliseconds to seconds
    const totalMinutes = Math.floor(totalSeconds / 60); // Convert seconds to minutes

    return `${totalMinutes}`; // Return the total time difference in minutes
  }

  normalizeEmailForMSAL(email: string) {
    const aliasCanonical = {
      'tes.com.pk': 'tw1.com',
    };
    const [username, domain] = email.split('@');
    const canonicalDomain = aliasCanonical[domain] || domain;
    return `${username}@${canonicalDomain}`;
  }
}
