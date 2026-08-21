import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MailService } from '@services/mail.service';
import { IAgencyContact } from '@shared/interfaces';
import { catchError } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { AlertTypes } from '@shared/enums';

@Component({
  selector: 'app-agency-form-dialog',
  templateUrl: './agency-form-dialog.component.html',
  styleUrl: './agency-form-dialog.component.scss',
  imports: [
    TranslateModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class AgencyFormDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AgencyFormDialogComponent>);

  private fb = inject(FormBuilder);

  private mailService = inject(MailService);

  private notificationService = inject(NotificationService);

  public minDate = new Date(new Date().setDate(new Date().getDate() + 2));
  public maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  isSubmitting = signal(false);

  clientTypes = [
    'TOURISM',
    'BUSINESS',
    'EVENTS',
    'ORGANIZATION',
  ];
  eventTypes = [
    'CORPO',
    'TEAM_BUILDER',
    'BUSINESS',
    'BRAND',
    'TOURISM',
    'OTHER',
  ];
  guestsRanges = [
    '-10',
    '10 - 20',
    '20 - 30',
    '30 - 40',
    '+30',
  ];
  placesOptions = [
    'PARTICULAR',
    'RECOMMENDED',
  ];
  servicesList = [
    'FULL',
    'CATERING',
    'DECORATION',
    'FLOWERS',
    'PHOTOS',
    'MUSIC',
    'FORNITURE',
    'EVENT',
    'OTHER',
  ];

  form: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    company: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    clientType: [this.clientTypes[0], [Validators.required]],
    eventType: ['', [Validators.required]],
    guestsRange: ['', [Validators.required]],
    eventDate: [null, [Validators.required]],
    eventTime: ['12:30', [Validators.required]],
    placeChoice: [this.placesOptions[1], [Validators.required]],
    ownPlace: [''],
    services: [[]],
    budget: [],
    comments: ['']
  });

  toggleService(serviceName: string): void {
    const currentServices: string[] = this.form.get('services')?.value || [];
    const index = currentServices.indexOf(serviceName);

    if (index > -1) {
      currentServices.splice(index, 1);
    } else {
      currentServices.push(serviceName);
    }

    this.form.patchValue({ services: currentServices });
  }

  isServiceSelected(serviceName: string): boolean {
    const currentServices: string[] = this.form.get('services')?.value || [];
    return currentServices.includes(serviceName);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const contactForm = this.form.value as IAgencyContact
    this.form.disable();
    this.isSubmitting.set(true);
    this.mailService.sendAgencyContact(contactForm).pipe(catchError((err) => {
      this.form.enable();
      this.isSubmitting.set(false);
      console.log(err)
      throw err
    })).subscribe(response => {
      if (response) {
        this.notificationService.openNotification({ message: 'PUBLIC.PACKAGES.CORPORATIVE.FORM.SUCCESS' }, AlertTypes.SUCCESS)
        this.form.enable();
        this.form.reset();
      }
      this.isSubmitting.set(false);
    })
  }
}