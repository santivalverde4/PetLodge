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
            const ctx = context ? ` [${context}]` : '';
            return stack
              ? `${timestamp}${ctx} ${level}: ${message}\n${stack}`
              : `${timestamp}${ctx} ${level}: ${message}`;
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
