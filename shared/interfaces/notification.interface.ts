import { AlertTypes } from "../enums/alert-types.enum";

export interface INotification {
  message: string;
  button?: string;
  action?: () => any;
  type?: AlertTypes;
}