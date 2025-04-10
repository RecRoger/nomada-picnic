import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseBooleanInterceptor implements NestInterceptor {
  constructor(private readonly fields: string[]) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    this.fields.forEach((field) => {
      if (body[field]) {
        body[field] = body[field] === 'true'
      }
    })

    return next.handle();
  }
}