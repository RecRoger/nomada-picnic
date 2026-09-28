import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MailService } from '@services/mail.service';
import { IAgencyContact } from '@shared/interfaces';
import { catchError } from 'rxjs';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { AnalyticsService } from '@services/analytics.service';

@Component({
  selector: 'app-agency-form-dialog',
  templateUrl: './agency-form-dialog.component.html',
  styleUrl: './agency-form-dialog.component.scss',
  imports: [
    TranslatePipe,
    MatDialogModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    AppleEmojiPipe
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

  private analyticsService = inject(AnalyticsService);

  public minDate = new Date(new Date().setDate(new Date().getDate() + 2));
  public maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  public isSubmitting = signal(false);

  public showConfirmation = false;

  public clientTypes = [
    'TOURISM',
    'BUSINESS',
    'EVENTS',
    'ORGANIZATION',
  ];
  public eventTypes = [
    'CORPO',
    'TEAM_BUILDER',
    'BUSINESS',
    'BRAND',
    'TOURISM',
    'OTHER',
  ];
  public guestsRanges = [
    '-10',
    '10 - 20',
    '20 - 30',
    '30 - 40',
    '+30',
  ];
  public placesOptions = [
    'PARTICULAR',
    'RECOMMENDED',
  ];
  public servicesList = [
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

  public form: FormGroup = this.fb.group({
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

  public toggleService(serviceName: string): void {
    const currentServices: string[] = this.form.get('services')?.value || [];
    const index = currentServices.indexOf(serviceName);

    if (index > -1) {
      currentServices.splice(index, 1);
    } else {
      currentServices.push(serviceName);
    }

    this.form.patchValue({ services: currentServices });
  }

  public isServiceSelected(serviceName: string): boolean {
    const currentServices: string[] = this.form.get('services')?.value || [];
    return currentServices.includes(serviceName);
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const contactForm = this.form.value as IAgencyContact
    this.form.disable();
    this.isSubmitting.set(true);
    this.analyticsService.logEvent('generate_lead', {
      form_type: 'corporate', company_name: this.form.value.company
    })
    this.mailService.sendAgencyContact(contactForm).pipe(catchError((err) => {
      this.form.enable();
      this.isSubmitting.set(false);
      console.log(err)
      throw err
    })).subscribe(response => {
      if (response) {
        this.form.enable();
        this.form.reset();
        this.showConfirmation = true;
      }
      this.isSubmitting.set(false);
    })
  }
}