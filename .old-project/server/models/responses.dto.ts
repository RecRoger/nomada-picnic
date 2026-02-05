import { ApiProperty } from '@nestjs/swagger';
import { ComunicationStatus } from 'server/enums/comunication-status.enum';

export class ResponseDto<T> {
  @ApiProperty({ description: 'Estado de la peticion' })
  status: ComunicationStatus;

  @ApiProperty({ description: 'Mensaje de la peticion' })
  message?: string;

  @ApiProperty({ description: 'Informacion de error' })
  errorCode?: string;

  @ApiProperty({ description: 'Datos de respuesta', type: Object })
  data?: T;
}