import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { CartService } from '@services/cart.service';

export interface IPicnicConfirmationDetails {
  bookingNumber: string;
  completeName: string;
  date?: string | Date;
  time?: string;
  location?: string;
  experienceName?: string;
}

@Component({
  selector: 'app-checkout-confirmation',
  imports: [TranslateModule, DatePipe, AppleEmojiPipe],
  templateUrl: './checkout-confirmation.component.html',
  styleUrl: './checkout-confirmation.component.scss'
})
export class CheckoutConfirmationComponent {
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public bookingDetails = signal<IPicnicConfirmationDetails>({
    bookingNumber: '',
    completeName: '',
    date: '',
    time: '',
    location: '',
    experienceName: ''
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const { picnicId, placeName, packageName, eventDate, eventTime, clientName } = params
      if (
        picnicId &&
        placeName &&
        packageName &&
        eventDate &&
        eventTime &&
        clientName
      ) {
        this.bookingDetails.set({
          bookingNumber: picnicId as string,
          completeName: `${clientName.replaceAll('_', ' ')}`,
          date: new Date(eventDate),
          time: eventTime,
          location: placeName.replaceAll('_', ' '),
          experienceName: packageName.replaceAll('_', ' ')
        })
        this.cartService.clearCart()
      } else {
        this.router.navigate(['/checkout/payment'])
      }
    });
  }

  public openWhatsApp(): void {
    let message = `¡Hola! Mi nombre es ${this.bookingDetails()?.completeName} y tengo algunas dudas sobre mi reserva de ${this.bookingDetails().experienceName} bajo el numero de reserva ${this.bookingDetails().bookingNumber}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${'5491126908781'}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}
