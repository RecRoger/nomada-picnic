/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;

    this.logger.log(`[${method}] ${url}`);
    if (body) this.logger.debug(` - Request: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap((data) => {
        this.logger.debug(`[${method}] ${url}`);
        this.logger.debug(
          `- Response: ${JSON.stringify(data)}`,
          LoggingInterceptor.name,
        );
      }),
    );
  }
}
