import { ICost, IPicnicEvent, IPicnicPackage, IPlace } from "@shared/interfaces";

// Modelo para un adicional seleccionado en el carrito
export interface ICartAdditional {
  cost: ICost;                // Objeto completo
  totalPrice: number;
  quantity: number;
}

// Configuración completa de la reserva del picnic
export interface IPicnicBooking {
  package: IPicnicPackage;    // Objeto completo
  event: IPicnicEvent;        // Objeto completo
  place: IPlace;              // Objeto completo
  minGuests: number;
  maxGuests: number;
  eventDate: Date | string;
  eventTime: string;
  basePrice: number;
}

// Estado global del Carrito
export interface IBookingCart {
  booking: IPicnicBooking | null;
  additionals: ICartAdditional[];
}