import { ComunicationStatus } from '../enums/comunication-status.enum';

export interface IApiResponse<T> {
  status: ComunicationStatus;
  message?: string;
  errorCode?: string;
  data?: T;
}