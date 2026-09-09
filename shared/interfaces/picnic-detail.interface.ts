import { BookingStatus, PaymentMethods, PaymentTypes } from "../enums";
import { IBookingClientInfo } from "./booking-cart.interface";
import { ICost } from "./cost.interface";
import { IPicnicEvent } from "./picnic-event.interface";
import { IPicnicPackage } from "./picnic-package.interface";
import { IPlace } from "./place.interface";

export type IPicnicPackageSelected = Pick<
  IPicnicPackage,
  '_id' | 'name' | 'description' | 'includedItems'
>;

export type IPicnicEventSelected = Pick<
  IPicnicEvent,
  '_id' | 'name'
>;

export type IPlaceSelected = Pick<
  IPlace,
  '_id' | 'name' | 'address' | 'location' | 'mapsLink'
>;

export type ICostSelected = Pick<
  ICost,
  '_id' | 'name' | 'type' | 'guestsCoverage'
>;

export interface IPicnicAdditional {
  cost: ICostSelected;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface IPicnicDetail {
  _id?: any;
  package: IPicnicPackageSelected;
  event: IPicnicEventSelected;
  place: IPlaceSelected;
  minGuest: number;
  maxGuest: number;
  eventDate: Date;
  eventTime: string;
  basePrice: number;
  additionals: IPicnicAdditional[];
  clientInfo: IBookingClientInfo;
  status: BookingStatus;
  totalAmount: number;
  depositAmount: number;
  paymentOption: PaymentTypes;
  paymentMethod: PaymentMethods;
  paidAmount: number;
  pendingAmount: number;
  preferenceId?: string;
  paymentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}