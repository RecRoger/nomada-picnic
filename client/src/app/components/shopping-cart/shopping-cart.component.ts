import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CartService } from '@services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CartDetailComponent } from '@components/cart-detail/cart-detail.component';
import { ICartAdditional } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    CommonModule,
    TranslateModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    AppleEmojiPipe,
    CurrencyPipe,
    CartDetailComponent,
    ApiImageUrlPipe
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  protected cartService = inject(CartService)

  private router = inject(Router)

  public checkPincis(): void {
    this.router.navigate(['/picnics'])
    this.cartService.closeCart()
  }

  public removePicnic(): void {
    this.cartService.removeBooking()
    this.cartService.toggleDetails(false)
  }

  public decreaseAdditional(additional: ICartAdditional) {
    if (additional.quantity > 1) {
      this.cartService.updateAdditionalQuantity(additional.cost._id!, additional.quantity - 1);
    } else {
      this.removeAdditional(additional);
    }
  }

  public increaseAdditional(additional: ICartAdditional) {
    this.cartService.updateAdditionalQuantity(additional.cost._id!, additional.quantity + 1);
  }

  public removeAdditional(additional: ICartAdditional) {
    this.cartService.removeAdditional(additional.cost._id!);
  }

  public goToCheckout(): void {
    // TODO - logica saltar al checkout
    const booking = this.cartService.booking()
    const additionals = this.cartService.additionals()
    const eventDate = new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(booking!.eventDate as Date);
    let message = `¡Hola! Me gustaria confirmar un ${booking!.package!.name}:
    - Nº de invitados: de ${booking!.minGuests} ${booking!.minGuests === booking!.maxGuests ? '' : ' - ' + booking!.maxGuests} personas.
    - Lugar: ${booking!.place!.name}.
    - Fecha y hora: ${eventDate} a las ${booking!.eventTime}.
    - Evento: ${booking!.event!.name}.
    - Precio del picnic: US$ ${booking!.basePrice}. \n`;
    if (additionals.length) {
      let additionalsText = '\nCon los siguientes adicionales: \n'
      additionalsText = additionalsText + additionals.map(add => `- ${add.cost.name}\n   US$ ${add.cost.finalPrice} x ${add.quantity} = US$ ${add.totalPrice} \n`).join('')
      message = message + additionalsText
    }
    message = message + 'Quedo a la espera de metodos de pago y formas de proceder con la reserva 😇.'
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${'5491126908781'}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

  }
}
