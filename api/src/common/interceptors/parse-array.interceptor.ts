import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseArrayInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ParseArrayInterceptor.name);

  constructor(private readonly fields: string[]) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    this.fields.forEach((field) => {
      if (body[field]) {
        body[field] = body[field].split(',')
      }
    })

    return next.handle();
  }
}