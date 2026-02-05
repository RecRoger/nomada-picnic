import { ComunicationStatus } from '../enums/comunication-status.enum';

export interface IResponse<T> {
  status: ComunicationStatus;
  message?: string;
  errorCode?: string;
  data?: T;
}