import { CommonModule } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { EventSelectorComponent } from '@components/event-selector/event-selector.component';
import { LoaderComponent } from '@components/loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '@services/cart.service';
import { PlacesService } from '@services/places.service';
import { PlacesTypes } from '@shared/enums';
import { IPicnicEvent, IPlace } from '@shared/interfaces';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.scss',
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    RouterLink,
    EventSelectorComponent,
    LoaderComponent
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class CartDetailComponent {
  protected readonly cartService = inject(CartService)
  public detailPages = [
    'base',
    'date',
    'time',
    'place',
    'event'
  ]
  public currentPage = signal<string>(this.detailPages[0])

  public minDate = new Date(new Date().setDate(new Date().getDate() + 2));
  public maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  public availableTimes = [
    { time: '10:00', label: 'MORNING' },
    { time: '12:30', label: 'NOON' },
    { time: '15:00', label: 'EVENING' },
    { time: '17:30', label: 'LATE_EVENING' },
    { time: '19:30', label: 'DOWN' },
  ]

  public places$ = inject(PlacesService).getPlacesCached(PlacesTypes.PUBLIC)

  placeSelectOpen = false;

  public setPage(page: number): void {
    this.currentPage.set(this.detailPages[page]);
  }

  toggleDropdown() {
    this.placeSelectOpen = !this.placeSelectOpen;
  }

  public selectDate(date: Date | null): void {
    this.cartService.updateBookingDetails({
      eventDate: date as Date
    })
  }

  public selectTime(time: string): void {
    this.cartService.updateBookingDetails({
      eventTime: time
    })
  }

  seleccionar(place: IPlace) {
    this.cartService.updateBookingDetails({
      place
    })
    this.placeSelectOpen = false;
  }

  selectEvent(event: IPicnicEvent) {
    this.cartService.updateBookingDetails({
      event
    })
  }

}
