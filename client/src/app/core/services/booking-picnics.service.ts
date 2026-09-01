import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@constants/api-url';
import { CartService } from '@services/cart.service';
import { NotificationService } from '@services/notification.service';
import { AlertTypes } from '@shared/enums';
import { IBookingCart, IBookingClientInfo, ICartAdditionalDto, ICreatePicnicDto, IPicnicBookingDto } from '@shared/interfaces';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingPicnicsService {
  private readonly http: HttpClient = inject(HttpClient)
  private cartService = inject(CartService)

  private readonly notificationService: NotificationService = inject(NotificationService)

  public saveBooking(partialPay = false): Observable<any> {
    const bookingBody = this.mapCartToCreatePicnicDto({
      booking: this.cartService.booking(),
      additionals: this.cartService.additionals(),
      clientInfo: this.cartService.clientForm(),
    })
    return this.http.post(API_URL + '/api/picnics', bookingBody, {
      ...(partialPay ? { params: { payType: 'deposit' } } : {})
    }).pipe(
      map((response: any) => {
        if (response) {
          return response.data as any
        }
        return null
      }),
      catchError((error) => {
        this.notificationService.openNotification({ message: 'Error al reservar Picnic' }, AlertTypes.ERROR)
        console.error('No se creó el costo:', error);
        return of(null);
      })
    );
  }



  private mapCartToCreatePicnicDto(cart: IBookingCart): ICreatePicnicDto {
    if (!cart.booking) {
      throw new Error('No se encontró la configuración del picnic en el carrito.');
    }

    if (!cart.clientInfo) {
      throw new Error('Faltan los datos personales del cliente para completar la reserva.');
    }

    const { booking, additionals, clientInfo } = cart;

    // Normalizar fecha a string ISO 8601
    const eventDateIso = booking.eventDate instanceof Date
      ? booking.eventDate.toISOString()
      : new Date(booking.eventDate || Date.now()).toISOString();

    // Mapeo del sub-objeto Booking
    const bookingDto: IPicnicBookingDto = {
      packageId: booking.package?._id || '',
      eventId: booking.event?._id,
      placeId: booking.place?._id,
      minGuest: booking.minGuests ?? 2,
      maxGuest: booking.maxGuests ?? 2,
      eventDate: eventDateIso,
      eventTime: booking.eventTime || '',
      basePrice: booking.basePrice ?? 0,
    };

    // Mapeo de la lista de adicionales
    const additionalsDto: ICartAdditionalDto[] = additionals.map((add) => ({
      costId: add.cost._id || '',
      unitPrice: add.unitPrice,
      quantity: add.quantity,
      totalPrice: add.totalPrice,
    }));

    // Mapeo de la información del cliente
    const clientInfoDto: IBookingClientInfo = {
      name: clientInfo.name,
      lastname: clientInfo.lastname,
      email: clientInfo.email,
      phone: clientInfo.phone,
      boardMessage: clientInfo.boardMessage,
      giftDrinks: clientInfo.giftDrinks,
      honoredName: clientInfo.honoredName,
      comments: clientInfo.comments,
      requiredBill: clientInfo.requiredBill ?? false,
      socialName: clientInfo.socialName,
      cuit: clientInfo.cuit,
      ivaCondition: clientInfo.ivaCondition,
      tyc: clientInfo.policy ? clientInfo.tyc : false,
      policy: clientInfo.policy,
    };

    return {
      booking: bookingDto,
      additionals: additionalsDto,
      clientInfo: clientInfoDto,
    };
  }
}
