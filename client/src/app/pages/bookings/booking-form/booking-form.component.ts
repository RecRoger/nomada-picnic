import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '@components/loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { BookingPicnicsService } from '@services/booking-picnics.service';
import { NotificationService } from '@services/notification.service';
import { BUSINESS_NUMBER } from '@shared/const';
import { AlertTypes } from '@shared/enums';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-booking-form',
  imports: [
    TranslateModule,
    LoaderComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent {

  public readonly WH_BUTTON = BUSINESS_NUMBER

  private fb = inject(FormBuilder);

  private readonly bookingService = inject(BookingPicnicsService)

  private readonly notificationService = inject(NotificationService)

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  public bookingForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    bookingId: [this.route.snapshot.queryParams['id'] || '', [
      Validators.required,
      Validators.maxLength(24),
      Validators.minLength(24),
    ]],
  });

  public loading = false;

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.loading = true;
      const { name, lastname, bookingId } = this.bookingForm.value
      this.bookingService.getPicnicData(bookingId, name, lastname).pipe(
        catchError(err => {
          this.notificationService.openNotification({ message: 'BOOKINGS.FORM.ERROR_MESSAGE' }, AlertTypes.ERROR)
          this.loading = true;
          throw err
        })
      ).subscribe(booking => {
        if (booking?._id === bookingId) {
          this.router.navigate(['/bookings', bookingId])
        }
        this.loading = false;
      })
    }
  }
}
