import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComunicationStatus } from '@shared/enums';
import { IApiResponse } from '@shared/interfaces';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  IApiResponse<T>
> {
  private readonly logger = new Logger('RequestInterceptor');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> {
    this.logger.debug('--> START REQUEST')
    return next.handle().pipe(
      map((data) => {
        this.logger.debug('--> END REQUEST')
        return ({
          status: ComunicationStatus.OK as ComunicationStatus,
          message: 'Operación exitosa',
          data: data as T, // Aquí van tus lugares, usuarios, etc.
        })
      }),
    );
  }
}
