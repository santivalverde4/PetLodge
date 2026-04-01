import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Logger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const userId = (request as any).currentUser?.id ?? 'anonymous';
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const ms = Date.now() - start;
        this.logger.info(`${method} ${url} ${response.statusCode} +${ms}ms`, {
          context: 'HTTP',
          userId,
        });
      }),
      catchError((err: Error) => {
        const ms = Date.now() - start;
        this.logger.error(`${method} ${url} +${ms}ms — ${err.message}`, {
          context: 'HTTP',
          userId,
          stack: err.stack,
        });
        return throwError(() => err);
      }),
    );
  }
}
