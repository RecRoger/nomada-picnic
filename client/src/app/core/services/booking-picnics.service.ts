import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { API_URL } from '@constants/api-url';
import { CartService } from '@services/cart.service';
import { NotificationService } from '@services/notification.service';
import { AlertTypes, PaymentTypes } from '@shared/enums';
import { IBookingCart, IBookingClientInfo, ICartAdditionalDto, ICreatePicnicDto, IPicnicBookingDto } from '@shared/interfaces';
import { IPicnicDetail } from '@shared/interfaces/picnic-detail.interface';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingPicnicsService {
  private readonly http: HttpClient = inject(HttpClient)
  private cartService = inject(CartService)

  private readonly notificationService: NotificationService = inject(NotificationService)

  public bookingData = signal<IPicnicDetail | null>(null);

  public bookingClient = computed(() => this.bookingData()?.clientInfo);

  public bookingAdditionals = computed(() => this.bookingData()?.additionals || []);

  public bookingDaysLeft = computed(() => {
    const today = new Date();
    const event = new Date(this.bookingData()?.eventDate || today);
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  });

  public bookingPaidPercentage = computed(() => {
    const { totalAmount, paidAmount } = this.bookingData() || {}
    if (!totalAmount || totalAmount <= 0) return 0;
    const percentage = ((paidAmount || 1) / totalAmount) * 100;
    return Math.min(100, Math.round(percentage));
  });

  constructor() {
    const savedCart = this.loadCartFromStorage();
    if (savedCart) {
      this.bookingData.set(savedCart);
    }
    effect(() => {
      const currentCart = this.bookingData();
      try {
        localStorage.setItem('nomada-booking', JSON.stringify(currentCart));
      } catch (error) {
        console.error('Error guardando el carrito en localStorage:', error);
      }
    });
  }
  private loadCartFromStorage(): IPicnicDetail | null {
    try {
      const saved = localStorage.getItem('nomada-booking');
      if (!saved) return null;
      const parsed = JSON.parse(saved) as IPicnicDetail;
      return parsed;
    } catch (error) {
      console.error('Error leyendo booking del localStorage:', error);
      return null;
    }
  }


  public saveBooking(payMethod: string, partialPay = false): Observable<string | null> {
    const bookingBody = this.mapCartToCreatePicnicDto({
      booking: this.cartService.booking(),
      additionals: this.cartService.additionals(),
      clientInfo: this.cartService.clientForm(),
    })
    return this.http.post(API_URL + '/api/picnics', bookingBody, {
      params: {
        payOption: partialPay ? PaymentTypes.DEPOSIT : PaymentTypes.FULL,
        payMethod,
      }
    }).pipe(
      map((response: any) => {
        if (response) {
          return response.data as string
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

  public getPicnicData(id: string, name: string, lastname: string): Observable<IPicnicDetail | null> {
    return this.http.get(API_URL + '/api/picnics/' + id, {
      params: {
        name: name.replaceAll(' ', ''),
        lastname: lastname.replaceAll(' ', ''),
      }
    }).pipe(
      map((response: any) => {
        if (response) {
          this.bookingData.set(response.data)
          return response.data as IPicnicDetail
        }
        this.bookingData.set(null)
        return null
      }),
      catchError((error) => {
        this.notificationService.openNotification({ message: 'BOOKINGS.FORM.ERROR_MESSAGE' }, AlertTypes.ERROR)
        console.error('No se consultó el costo:', error);
        this.bookingData.set(null)
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
