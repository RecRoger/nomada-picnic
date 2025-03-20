import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../models/responses.dto';
import { COM_STATUS } from 'server/enums/comunication-status.enum';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: COM_STATUS.OK,
        data,
      })),
    );
  }
}