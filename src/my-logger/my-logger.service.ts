import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as winston from 'winston';
import { createLogger, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, label, printf } = winston.format;

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  configService = new ConfigService();

  customFormat = printf(({ timestamp, level, context, message }) => {
    const contextString = context ? `[${context}]` : '[]';
    return `${timestamp} | ${level} | ${contextString} --- ${message}`;
  });

  loggerPathDirectory = this.configService.get<string>('LOGGER_PATH')
    ? this.configService.get<string>('LOGGER_PATH')
    : '../logs/';

  loggerFileName = this.configService.get<string>('LOGGER_LOGS_FILENAME')
    ? this.configService.get<string>('LOGGER_LOGS_FILENAME')
    : 'myLoggerFile.log';

  logger = createLogger({
    level: 'debug',
    format: combine(
      label({ label: 'CATEGORY' }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      this.customFormat,
    ),
    transports: [
      new transports.File({
        dirname: this.loggerPathDirectory,
        filename: this.loggerFileName,
      }),
      new DailyRotateFile({
        filename: `${this.loggerFileName}-%DATE%.log`,
        dirname: this.loggerPathDirectory,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '1d',
      }),
    ],
  });

  log(message: any, context?: string) {
    this.logger.info(message, { context: context });

    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    this.logger.error(message, { context: stackOrContext });

    super.error(message, stackOrContext);
  }

  info(message: any, stackOrContext?: string) {
    this.logger.info(message, { context: stackOrContext });

    super.log(message, stackOrContext);
  }

  debug(message: any, stackOrContext?: string) {
    this.logger.debug(message, { context: stackOrContext });

    super.debug(message, stackOrContext);
  }
}
