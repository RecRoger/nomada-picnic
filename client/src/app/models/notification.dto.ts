import { ALERT_TYPES } from "../enums/alert-types.enum";

export interface NotificationData {
  message: string;
  button?: string;
  action?: () => any;
  type?: ALERT_TYPES;
}