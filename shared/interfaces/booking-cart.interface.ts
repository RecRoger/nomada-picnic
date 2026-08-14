import { ICost, IPicnicEvent, IPicnicPackage, IPlace } from "@shared/interfaces";

// Modelo para un adicional seleccionado en el carrito
export interface ICartAdditional {
  cost: ICost;
  totalPrice: number;
  quantity: number;
}

// Configuración completa de la reserva del picnic
export interface IPicnicBooking {
  package?: IPicnicPackage;
  event?: IPicnicEvent;
  place?: IPlace;
  minGuests?: number;
  maxGuests?: number;
  eventDate?: Date | string;
  eventTime?: string;
  basePrice?: number;
}

// Estado global del Carrito
export interface IBookingCart {
  booking: IPicnicBooking | null;
  additionals: ICartAdditional[];
}