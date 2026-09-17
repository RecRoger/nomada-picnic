import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { AnalyticsService } from '@services/analytics.service';
import { BookingPicnicsService } from '@services/booking-picnics.service';
import { BUSINESS_MAIL, BUSINESS_NUMBER } from '@shared/const';

@Component({
  selector: 'app-booking-detail',
  imports: [CommonModule, TranslateModule, MatIconModule, AppleEmojiPipe],
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.scss'
})
export class BookingDetailComponent implements OnInit {
  private readonly bookingService = inject(BookingPicnicsService)

  private readonly router = inject(Router)

  private readonly route = inject(ActivatedRoute)

  private analyticsService = inject(AnalyticsService)

  public bookingData = this.bookingService.bookingData()

  public daysLeft = this.bookingService.bookingDaysLeft()

  public paidPercentage = this.bookingService.bookingPaidPercentage()

  public clientData = this.bookingService.bookingClient()

  public additionals = this.bookingService.bookingAdditionals()

  public weather = signal('10')

  // http://localhost:4200/bookings/6aa20640401be9bbb00a0182
  async ngOnInit(): Promise<void> {
    this.analyticsService.setNoIndex()

    if (!this.bookingService.bookingData() || this.route.snapshot.params['id'] !== this.bookingService.bookingData()?._id) {
      this.router.navigate(['/bookings'])
    }
    const { lat, lng } = this.bookingData?.place.location || {}
    const weather = await this.getWeatherForDate(lat, lng, new Date(this.bookingData?.eventDate || '').toISOString().split('T')[0])
    this.weather.set(weather)
  }

  public callAction(action: 'date' | 'edit' | 'cancel' | 'whatsapp' | 'mail'): void {
    if (action == 'mail') {
      const email = BUSINESS_MAIL;
      const subject = encodeURIComponent('Consulta sobre reserva ' + this.bookingData?._id);
      const body = encodeURIComponent('Hola, quisiera realizar una consulta sobre mi reserva...');

      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    } else {
      const messages = {
        'date': `¡Hola! Me gustaria reprogramar mi reserva número ${this.bookingData?._id} del dia ${new Date(this.bookingData?.eventDate || '').toLocaleDateString()}.`,
        'edit': `¡Hola! Me gustaria modificar algo en mi reserva número ${this.bookingData?._id}`,
        'cancel': `¡Hola! Disculpen, pero necesito cancelar mi reserva del picnic número ${this.bookingData?._id}.`,
        'whatsapp': `¡Hola! Me gustaria consultar algo referente a mi reserva del picnic número ${this.bookingData?._id}.`,
      }
      const encodedMessage = encodeURIComponent(messages[action]);
      const whatsappUrl = `https://wa.me/${BUSINESS_NUMBER}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  }

  async getWeatherForDate(lat: number = -34.6037, lon: number = -58.3816, targetDate: string = new Date().toISOString().split('T')[0]): Promise<string> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,precipitation_probability_max,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${targetDate}&end_date=${targetDate}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const daily = data.daily;
      return daily?.precipitation_probability_max[0] || null
    } catch (error) {
      console.error('Error al consultar el clima:', error);
      return '10';
    }
  }


}
