import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseNumberInterceptor implements NestInterceptor {
  constructor(private readonly fields: string[]) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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