import { IBookingClientInfo } from "./booking-cart.interface";

export interface ICartAdditionalDto {
  costId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface IPicnicBookingDto {
  packageId: string;
  eventId?: string;
  placeId?: string;
  minGuest: number;
  maxGuest: number;
  eventDate: string; // ISO 8601 String
  eventTime: string;
  basePrice: number;
}

export interface ICreatePicnicDto {
  booking: IPicnicBookingDto;
  additionals: ICartAdditionalDto[];
  clientInfo: IBookingClientInfo;
}