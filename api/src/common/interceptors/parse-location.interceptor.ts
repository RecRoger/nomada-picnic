import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseLocationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ParseLocationInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('[Location parser intercept]')
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    if (body.location) {
      const value = JSON.parse(body.location)
      if (value?.lat && value?.lng) {
        body.location = value
      }
    }
    return next.handle();
  }
}