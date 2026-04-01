import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get<string>('NODE_ENV') === 'production';

        const productionFormat = winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        );

        const developmentFormat = winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'HH:mm:ss' }),
          winston.format.errors({ stack: true }),
          winston.format.printf(({ level, message, timestamp, context, stack }) => {
            const ctx = typeof context === 'string' && context ? ` [${context}]` : '';
            const ts = typeof timestamp === 'string' ? timestamp : '';
            const msg = typeof message === 'string' ? message : String(message);
            const stackStr = typeof stack === 'string' ? stack : undefined;
            return stackStr
              ? `${ts}${ctx} ${level}: ${msg}\n${stackStr}`
              : `${ts}${ctx} ${level}: ${msg}`;
          }),
        );

        return {
          transports: [
            new winston.transports.Console({
              level: isProduction ? 'info' : 'debug',
              format: isProduction ? productionFormat : developmentFormat,
            }),
          ],
        };
      },
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
