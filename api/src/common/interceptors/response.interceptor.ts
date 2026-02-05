import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComunicationStatus } from '@shared/enums';
import { IResponse } from '@shared/interfaces';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  IResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: ComunicationStatus.OK as ComunicationStatus,
        message: 'Operación exitosa',
        data: data as T, // Aquí van tus lugares, usuarios, etc.
      })),
    );
  }
}
