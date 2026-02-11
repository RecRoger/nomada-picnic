import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORMS_MODULES } from '@constants/material-modules';
import { TranslateModule } from '@ngx-translate/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    ...MAT_FORMS_MODULES
  ],
  providers: [
    provideNativeDateAdapter(MY_FORMATS),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.scss'
})
export class FormControlComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control?: FormControl;
  @Input() hints: string[] = []
  @Input() options: { value: string, text: string }[] = [];
  @Input() prefix?: string;
  @Input() suffix?: string;

  public readonly today = (new Date())

  public readonly INPUT_TYPE = ['text', 'number', 'email', 'password']

  public onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.control?.patchValue(fileList)
    }
  }
}
