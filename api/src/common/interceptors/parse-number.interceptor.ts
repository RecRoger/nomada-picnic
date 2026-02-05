import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseNumberInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ParseNumberInterceptor.name);

  constructor(private readonly fields: string[]) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('[Number parser intercept]')
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    this.fields.forEach((field) => {
      if (body[field]) {
        const value = Number(body[field])
        if (!isNaN(value)) {
          body[field] = value
        }
      }
    })

    return next.handle();
  }
}