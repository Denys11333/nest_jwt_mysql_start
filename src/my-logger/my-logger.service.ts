import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  configService = new ConfigService();

  async logToFile(entry) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Europe/Kyiv',
    }).format(new Date())}\t${entry}\n`;

    const defaultLoggerPath = './../../logs';
    const defaultLoggerFileName = 'myLogFile.log';

    try {
      if (
        !fs.existsSync(
          path.join(
            __dirname,
            this.configService.get<string>('LOGGER_PATH') || defaultLoggerPath,
          ),
        )
      ) {
        await fsPromises.mkdir(
          path.join(
            __dirname,
            this.configService.get<string>('LOGGER_PATH') || defaultLoggerPath,
          ),
        );
      }
      await fsPromises.appendFile(
        path.join(
          __dirname,
          this.configService.get<string>('LOGGER_PATH') || defaultLoggerPath,
          this.configService.get<string>('LOGGER_LOGS_FILENAME') + '.log' ||
            defaultLoggerFileName,
        ),
        formattedEntry,
      );
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  log(message: any, context?: string) {
    const entry = `${context}\t${message}`;

    this.logToFile(entry);

    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${message}`;

    this.logToFile(entry);

    super.error(message, stackOrContext);
  }
}
