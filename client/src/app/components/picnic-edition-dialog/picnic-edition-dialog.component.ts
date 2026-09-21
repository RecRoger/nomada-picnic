import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BookingStatus, PaymentMethods, PaymentTypes } from '@shared/enums';
import { IPicnicDetail } from '@shared/interfaces/picnic-detail.interface';

@Component({
  selector: 'app-picnic-edition-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    MatFormField,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './picnic-edition-dialog.component.html',
  styleUrl: './picnic-edition-dialog.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ]
})
export class PicnicEditionDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PicnicEditionDialogComponent>);
  readonly fb = inject(FormBuilder);

  readonly picnic = inject<IPicnicDetail>(MAT_DIALOG_DATA);

  public minDate = new Date(new Date().setDate(new Date().getDate() + 2));
  public maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  public PAY_TYPES = Object.keys(PaymentTypes) as (keyof typeof PaymentTypes)[];
  public PAY_METHODS = Object.keys(PaymentMethods) as (keyof typeof PaymentMethods)[];
  public BOOKING_STATUS = Object.keys(BookingStatus) as (keyof typeof BookingStatus)[];

  public DOLLAR_VALUE = 1530

  public form = this.fb.group({
    // place: [this.picnic.place._id],
    eventDate: [new Date(this.picnic.eventDate), Validators.required],
    eventTime: [this.picnic.eventTime, Validators.required],
    clientInfo: this.fb.group({
      name: [this.picnic.clientInfo.name],
      lastname: [this.picnic.clientInfo.lastname],
      email: [this.picnic.clientInfo.email],
      phone: [this.picnic.clientInfo.phone],
      boardMessage: [this.picnic.clientInfo.boardMessage],
      honoredName: [this.picnic.clientInfo.honoredName],
      // giftDrinks: [this.picnic.clientInfo.giftDrinks],
      comments: [this.picnic.clientInfo.comments],
      tyc: [this.picnic.clientInfo.tyc],
      policy: [this.picnic.clientInfo.policy],
    }),
    depositAmount: [this.picnic.depositAmount, Validators.required],
    paidAmount: [this.picnic.paidAmount],
    paymentOption: [this.picnic.paymentOption, Validators.required],
    paymentMethod: [this.picnic.paymentMethod, Validators.required],
    status: [this.picnic.status, Validators.required],
  })

  async ngOnInit(): Promise<void> {
    await this.getDolar()
  }

  async getDolar() {
    await fetch('https://dolarapi.com/v1/dolares/oficial')
      .then(response => response.json())
      .then(data => {
        this.DOLLAR_VALUE = data.venta
      });
  }
}
